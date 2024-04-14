import { TicketNumbersCostMap } from '@/core/entities/types/ticket-numbers-cost-map'

export abstract class TicketsCostsRepository {
  abstract findByKey(key: number): Promise<number>
  abstract create(ticketNumbersCostMap: TicketNumbersCostMap): Promise<void>
  abstract update(key: number, val: number): Promise<void>
}
