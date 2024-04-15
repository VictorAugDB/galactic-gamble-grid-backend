import { Pagination } from '@/core/entities/types/pagination'
import { Ticket } from '../entities/ticket'
import { TicketsRepository } from '../repositories/tickets-repository'
import { PAGINATION } from '@/core/config/pagination'
import { Injectable } from '@nestjs/common'

type ListTicketsUseCaseRequest = {
  userId: string
  pagination?: Pagination
}

@Injectable()
export class ListTicketsUseCase {
  constructor(private ticketsRepository: TicketsRepository) {}

  async execute({
    userId,
    pagination = PAGINATION,
  }: ListTicketsUseCaseRequest): Promise<Ticket[]> {
    const tickets = await this.ticketsRepository.findActiveTicketsByUserId(
      userId,
      pagination,
    )

    return tickets
  }
}
