import { Pagination } from '@/core/entities/types/pagination'
import { Bet } from '../entities/bet'
import { BetRewardTransaction } from '../entities/bet-reward-transaction'

export abstract class BetsRepository {
  abstract findById(id: string): Promise<Bet | null>
  abstract findManyByUserId(
    userId: string,
    pagination?: Pagination,
  ): Promise<Bet[]>

  abstract create(bet: Bet, transactions: BetRewardTransaction[]): Promise<void>
}
