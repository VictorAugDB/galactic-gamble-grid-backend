import { Bet } from '../entities/bet'
import { BetRewardTransaction } from '../entities/bet-reward-transaction'

export abstract class BetsRepository {
  abstract findById(id: string): Promise<Bet | null>
  abstract create(bet: Bet, transactions: BetRewardTransaction[]): Promise<void>
}
