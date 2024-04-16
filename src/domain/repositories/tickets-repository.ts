import { Pagination } from '@/core/entities/types/pagination'
import { Ticket } from '../entities/ticket'

export abstract class TicketsRepository {
  abstract findById(id: string): Promise<Ticket | null>
  abstract findActiveTicketsByUserId(
    userId: string,
    pagination: Pagination,
  ): Promise<Ticket[]>

  abstract countNumberOfActiveTicketsByUserId(userId: string): Promise<number>

  abstract create(ticket: Ticket): Promise<void>
  abstract save(ticket: Ticket): Promise<void>
}
