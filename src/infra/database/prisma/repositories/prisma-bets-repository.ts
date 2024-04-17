import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { BetsRepository } from '@/domain/repositories/bets-repository'
import { Pagination } from '@/core/entities/types/pagination'
import { Bet } from '@/domain/entities/bet'
import { BetRewardTransaction } from '@/domain/entities/bet-reward-transaction'
import { PAGINATION } from '@/core/config/pagination'
import { PrismaBetMapper } from '../mappers/prisma-bet-mapper'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { balance, profit } from '@/infra/cache/helpers'

@Injectable()
export class PrismaBetsRepository implements BetsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  findById(_id: string): Promise<Bet | null> {
    throw new Error('Method not implemented.')
  }

  async findManyByUserId(
    userId: string,
    pagination?: Pagination | undefined,
  ): Promise<Bet[]> {
    const bets = await this.prisma.bet.findMany({
      where: {
        userId,
      },
      include: {
        tickets: {
          include: {
            transaction: true,
          },
        },
      },
      skip: pagination ? pagination.page - 1 : 0,
      take: pagination ? pagination.size : PAGINATION.size,
    })

    return bets.map((b) => PrismaBetMapper.toDomain(b))
  }

  async calculateUserProfit(userId: string): Promise<number> {
    const cacheHit = await this.cache.get(profit(userId))

    if (cacheHit) {
      const cacheData = Number(cacheHit)
      return cacheData
    }

    const bets = await this.prisma.bet.findMany({
      where: {
        userId,
      },
      select: {
        totalRewards: true,
        tickets: {
          select: {
            transaction: {
              select: {
                value: true,
              },
            },
          },
        },
      },
    })

    const { totalRewardsSum, totalTicketsCostsSum } = bets.reduce(
      (acc, curr) => {
        acc.totalRewardsSum += curr.totalRewards
        acc.totalTicketsCostsSum += curr.tickets.reduce(
          (tacc, tcurr) => tacc + tcurr.transaction.value,
          0,
        )

        return acc
      },
      {
        totalRewardsSum: 0,
        totalTicketsCostsSum: 0,
      },
    )

    const userProfit = totalRewardsSum - totalTicketsCostsSum

    await this.cache.set(profit(userId), JSON.stringify(userProfit))

    return userProfit
  }

  async create(
    bet: Bet,
    transactions: BetRewardTransaction[],
  ): Promise<{ betId: string }> {
    try {
      const betRef = bet
      const transactionsRef = transactions
      let betId
      await this.prisma.$transaction(async (tx) => {
        const data = PrismaBetMapper.toPrisma(betRef, transactionsRef)
        const bet = await tx.bet.create({ data })

        await Promise.all(
          betRef.tickets.map((t) =>
            tx.ticket.update({
              where: {
                id: t.id.toString(),
              },
              data: {
                betId: bet.id,
                result: t.result === 'lose' ? 'LOSE' : 'WIN',
              },
            }),
          ),
        )

        betId = bet.id
      })

      if (transactionsRef.length) {
        await this.cache.delete(balance(bet.userId.toString()))
      }
      await this.cache.delete(profit(bet.userId.toString()))

      return { betId }
    } catch (err) {
      console.error('Error creating bet and updating tickets:', err)
      throw new BadRequestException('Error creating bet and updating tickets')
    }
  }
}
