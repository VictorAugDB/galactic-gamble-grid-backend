import { Ticket } from '../entities/ticket'

export abstract class TicketsRepository {
  abstract findById(id: string): Promise<Ticket | null>
  abstract findActiveTicketsByUserId(userId: string): Promise<Ticket[]>
  abstract create(ticket: Ticket): Promise<void>
  abstract save(ticket: Ticket): Promise<void>
}
