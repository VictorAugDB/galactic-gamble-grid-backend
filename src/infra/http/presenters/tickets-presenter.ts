import { Ticket } from '@/domain/entities/ticket'

type TicketsHTTP = {
  id: string
  userId: string
  betId?: string
  transactionId: string
  numbers: number[]
  result: 'win' | 'lose' | null
  createdAt: Date
  updatedAt: Date
}

export class TicketsPresenter {
  static toHTTP(ticket: Ticket): TicketsHTTP {
    return {
      id: ticket.id.toString(),
      numbers: ticket.numbers,
      result: ticket.result,
      transactionId: ticket.transactionId.toString(),
      userId: ticket.userId.toString(),
      betId: ticket.betId ? ticket.betId.toString() : undefined,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }
  }
}
