import { TicketNumbersCostMap } from '@/core/entities/types/ticket-numbers-cost-map'
import { TicketsCostsRepository } from '@/domain/repositories/tickets-costs-repository'
import { TICKETS_COSTS } from '../config/tickets-costs'

export class InMemoryTicketsCostsRepository implements TicketsCostsRepository {
  public items: TicketNumbersCostMap = TICKETS_COSTS

  findByKey(key: number): Promise<number> {
    return Promise.resolve(this.items[key])
  }

  findMany(): Promise<TicketNumbersCostMap> {
    throw new Error('Method not implemented.')
  }

  create(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  update(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
