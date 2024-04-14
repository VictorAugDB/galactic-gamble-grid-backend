import { Ticket } from '../entities/ticket'

export abstract class TicketsRepository {
  abstract findById(id: string): Promise<Ticket | null>
  abstract create(ticket: Ticket): Promise<void>
}
