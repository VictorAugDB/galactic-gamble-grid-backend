import { Ticket } from '@/domain/entities/ticket'
import { TicketsRepository } from '@/domain/repositories/tickets-repository'

export class InMemoryTicketsRepository implements TicketsRepository {
  public items: Ticket[] = []

  findById(id: string): Promise<Ticket | null> {
    return Promise.resolve(
      this.items.find((item) => item.id.toString() === id) ?? null,
    )
  }

  create(ticket: Ticket): Promise<void> {
    this.items.push(ticket)

    return Promise.resolve()
  }
}
