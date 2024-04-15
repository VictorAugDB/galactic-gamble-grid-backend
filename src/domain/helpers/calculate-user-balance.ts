import { AddMoneyTransaction } from '../entities/add-money-transaction'
import { BetRewardTransaction } from '../entities/bet-reward-transaction'
import { BuyTicketTransaction } from '../entities/buy-ticket-transaction'

export function calculateUserBalance(
  userTransactions: Array<
    BuyTicketTransaction | BetRewardTransaction | AddMoneyTransaction
  >,
) {
  return userTransactions.reduce((acc, curr) => {
    switch (curr.constructor) {
      case AddMoneyTransaction:
      case BetRewardTransaction:
        return acc + curr.value
      case BuyTicketTransaction:
        return acc - curr.value
      default:
        return acc
    }
  }, 0)
}
