import { Bet } from '@/domain/entities/bet'

export interface BetHTTP {
  id: string
  userId: string
  sortedNumbers: number[]
  totalRewards: number
  totalTicketsCost: number
  createdAt: Date
}

export class BetsPresenter {
  static toHTTP(bet: Bet): BetHTTP {
    const totalTicketsCost = bet.tickets.reduce(
      (acc, curr) => acc + curr.transaction.value,
      0,
    )

    return {
      id: bet.id.toString(),
      sortedNumbers: bet.sortedNumbers,
      totalRewards: bet.totalRewards,
      totalTicketsCost,
      userId: bet.userId.toString(),
      createdAt: bet.createdAt,
    }
  }
}
