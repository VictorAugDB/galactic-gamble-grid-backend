import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TransactionsRepository } from '@/domain/repositories/transactions-repository'
import { AddMoneyTransaction } from '@/domain/entities/add-money-transaction'
import { BetRewardTransaction } from '@/domain/entities/bet-reward-transaction'
import { BuyTicketTransaction } from '@/domain/entities/buy-ticket-transaction'
import { calculateUserBalance } from '@/domain/helpers/calculate-user-balance'
import { PrismaAddMoneyTransactionMapper } from '../mappers/prisma-add-money-transaction-mapper'
import { PrismaBuyTicketTransactionMapper } from '../mappers/prisma-buy-ticket-transaction-mapper'
import { PrismaBetRewardTransactionMapper } from '../mappers/prisma-reward-transaction'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { balance } from '@/infra/cache/helpers'

@Injectable()
export class PrismaTransactionsRepository implements TransactionsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  findById(
    _id: string,
  ): Promise<
    BetRewardTransaction | AddMoneyTransaction | BuyTicketTransaction
  > {
    throw new Error('Method not implemented.')
  }

  async getUserBalance(userId: string): Promise<number> {
    const cacheHit = await this.cache.get(balance(userId))

    if (cacheHit) {
      const cacheData = Number(cacheHit)
      return cacheData
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
      },
    })

    const domainTransactions = transactions.map((t) => {
      if (t.type === 'ADD_MONEY') {
        return PrismaAddMoneyTransactionMapper.toDomain(t)
      } else if (t.type === 'BUY_TICKET') {
        return PrismaBuyTicketTransactionMapper.toDomain(t)
      } else {
        return PrismaBetRewardTransactionMapper.toDomain(t)
      }
    })

    const userBalance = calculateUserBalance(domainTransactions)

    await this.cache.set(balance(userId), JSON.stringify(userBalance))

    return calculateUserBalance(domainTransactions)
  }

  async create(
    transaction:
      | BetRewardTransaction
      | AddMoneyTransaction
      | BuyTicketTransaction,
  ): Promise<void> {
    if (transaction instanceof BuyTicketTransaction) {
      const data = PrismaBuyTicketTransactionMapper.toPrisma(transaction)

      await this.prisma.transaction.create({
        data,
      })
    }

    if (transaction instanceof AddMoneyTransaction) {
      const data = PrismaAddMoneyTransactionMapper.toPrisma(transaction)

      await this.prisma.transaction.create({
        data,
      })
    }

    if (transaction instanceof BetRewardTransaction) {
      const data = PrismaBetRewardTransactionMapper.toPrisma(transaction)
      await this.prisma.transaction.create({
        data,
      })
    }

    await this.cache.delete(balance(transaction.userId.toString()))
  }
}
