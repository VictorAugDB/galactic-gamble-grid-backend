import { TicketNumbersCostMap } from '@/core/entities/types/ticket-numbers-cost-map'
import { TicketsCostsRepository } from '@/domain/repositories/tickets-costs-repository'

export class InMemoryTicketsCostsRepository implements TicketsCostsRepository {
  public items: TicketNumbersCostMap = {
    15: 3,
    16: 100,
    17: 300,
    18: 5000,
    19: 15000,
    20: 25000,
  }

  findByKey(key: number): Promise<number> {
    return Promise.resolve(this.items[key])
  }

  create(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  update(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
