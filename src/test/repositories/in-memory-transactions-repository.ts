import { AddMoneyTransaction } from '@/domain/entities/add-money-transaction'
import { BetRewardTransaction } from '@/domain/entities/bet-reward-transaction'
import { BuyTicketTransaction } from '@/domain/entities/buy-ticket-transaction'
import { TicketsRepository } from '@/domain/repositories/tickets-repository'
import { TransactionsRepository } from '@/domain/repositories/transactions-repository'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  constructor(private ticketsRepository: TicketsRepository) {}
  public items: Array<
    BuyTicketTransaction | BetRewardTransaction | AddMoneyTransaction
  > = []

  findById(
    id: string,
  ): Promise<
    BuyTicketTransaction | BetRewardTransaction | AddMoneyTransaction | null
  > {
    return Promise.resolve(
      this.items.find((item) => item.id.toString() === id) ?? null,
    )
  }

  getUserBalance(userId: string): Promise<number> {
    console.log(this.items)
    const userBalance = this.items.reduce((acc, curr) => {
      if (curr.userId.toString() === userId) {
        switch (curr.constructor) {
          case AddMoneyTransaction:
          case BetRewardTransaction:
            return acc + curr.value
          case BuyTicketTransaction:
            return acc - curr.value
          default:
            return acc
        }
      }

      return acc
    }, 0)

    return Promise.resolve(userBalance)
  }

  create(
    transaction:
      | BuyTicketTransaction
      | BetRewardTransaction
      | AddMoneyTransaction,
  ): Promise<void> {
    if (transaction instanceof BuyTicketTransaction) {
      this.items.push(transaction)
      this.ticketsRepository.create(transaction.ticket)
    }

    if (transaction instanceof AddMoneyTransaction) {
      this.items.push(transaction)
    }

    if (transaction instanceof BetRewardTransaction) {
      this.items.push(transaction)
    }

    return Promise.resolve()
  }
}
