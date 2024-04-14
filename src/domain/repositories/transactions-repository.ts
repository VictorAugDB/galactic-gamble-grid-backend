import { AddMoneyTransaction } from '../entities/add-money-transaction'
import { BetRewardTransaction } from '../entities/bet-reward-transaction'
import { BuyTicketTransaction } from '../entities/buy-ticket-transaction'

export abstract class TransactionsRepository {
  abstract findById(
    id: string,
  ): Promise<
    BuyTicketTransaction | BetRewardTransaction | AddMoneyTransaction | null
  >

  abstract getUserBalance(userId: string): Promise<number>
  abstract create(
    transaction:
      | BuyTicketTransaction
      | BetRewardTransaction
      | AddMoneyTransaction,
  ): Promise<void>
}
