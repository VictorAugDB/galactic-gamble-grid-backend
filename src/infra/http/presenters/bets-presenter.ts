import { Bet } from '@/domain/entities/bet'

export interface BetHTTP {
  id: string
  userId: string
  sortedNumbers: number[]
  createdAt: Date
}

export class BetsPresenter {
  static toHTTP(bet: Bet): BetHTTP {
    return {
      id: bet.id.toString(),
      sortedNumbers: bet.sortedNumbers,
      userId: bet.userId.toString(),
      createdAt: bet.createdAt,
    }
  }
}
