import { Ticket } from '@/domain/entities/ticket'
import { TicketsRepository } from '@/domain/repositories/tickets-repository'

export class InMemoryTicketsRepository implements TicketsRepository {
  public items: Ticket[] = []

  findById(id: string): Promise<Ticket | null> {
    return Promise.resolve(
      this.items.find((item) => item.id.toString() === id) ?? null,
    )
  }

  findActiveTicketsByUserId(userId: string): Promise<Ticket[]> {
    return Promise.resolve(
      this.items.filter(
        (item) => item.userId.toString() === userId && item.result === null,
      ),
    )
  }

  create(ticket: Ticket): Promise<void> {
    this.items.push(ticket)

    return Promise.resolve()
  }

  save(ticket: Ticket): Promise<void> {
    const idx = this.items.findIndex((item) => item.id.equals(ticket.id))

    this.items[idx] = ticket

    return Promise.resolve()
  }
}
