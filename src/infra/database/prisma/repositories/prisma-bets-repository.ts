import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { BetsRepository } from '@/domain/repositories/bets-repository'
import { Pagination } from '@/core/entities/types/pagination'
import { Bet } from '@/domain/entities/bet'
import { BetRewardTransaction } from '@/domain/entities/bet-reward-transaction'
import { PAGINATION } from '@/core/config/pagination'
import { PrismaBetMapper } from '../mappers/prisma-bet-mapper'

@Injectable()
export class PrismaBetsRepository implements BetsRepository {
  constructor(private prisma: PrismaService) {}

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

  async create(bet: Bet, transactions: BetRewardTransaction[]): Promise<void> {
    try {
      const betRef = bet
      const transactionsRef = transactions
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
      })
    } catch (err) {
      console.error('Error creating bet and updating tickets:', err)
      throw new BadRequestException('Error creating bet and updating tickets')
    }
  }
}
