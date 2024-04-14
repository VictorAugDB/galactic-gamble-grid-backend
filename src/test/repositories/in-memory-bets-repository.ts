import { Bet } from '@/domain/entities/bet'
import { BetRewardTransaction } from '@/domain/entities/bet-reward-transaction'
import { BetsRepository } from '@/domain/repositories/bets-repository'
import { TicketsRepository } from '@/domain/repositories/tickets-repository'
import { TransactionsRepository } from '@/domain/repositories/transactions-repository'

export class InMemoryBetsRepository implements BetsRepository {
  constructor(
    private ticketsRepository: TicketsRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  public items: Bet[] = []

  findById(id: string): Promise<Bet | null> {
    return Promise.resolve(
      this.items.find((item) => item.id.toString() === id) ?? null,
    )
  }

  async create(bet: Bet, transactions: BetRewardTransaction[]): Promise<void> {
    await Promise.all(
      bet.tickets.map((ticket) => this.ticketsRepository.save(ticket)),
    )
    await Promise.all(
      transactions.map((transaction) =>
        this.transactionsRepository.create(transaction),
      ),
    )

    this.items.push(bet)

    return Promise.resolve()
  }
}
