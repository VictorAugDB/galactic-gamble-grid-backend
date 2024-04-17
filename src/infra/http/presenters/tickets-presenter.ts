import { Ticket } from '@/domain/entities/ticket'

type TicketHTTP = {
  id: string
  userId: string
  betId?: string
  transaction: {
    value: number
  }
  numbers: number[]
  result: 'win' | 'lose' | null
  createdAt: Date
  updatedAt: Date
}

export class TicketsPresenter {
  static toHTTP(ticket: Ticket): TicketHTTP {
    return {
      id: ticket.id.toString(),
      numbers: ticket.numbers,
      result: ticket.result,
      transaction: {
        value: ticket.transaction.value,
      },
      userId: ticket.userId.toString(),
      betId: ticket.betId ? ticket.betId.toString() : undefined,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }
  }
}
