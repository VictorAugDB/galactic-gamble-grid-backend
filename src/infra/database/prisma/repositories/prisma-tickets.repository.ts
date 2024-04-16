import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TicketsRepository } from '@/domain/repositories/tickets-repository'
import { Pagination } from '@/core/entities/types/pagination'
import { Ticket } from '@/domain/entities/ticket'
import { PrismaTicketMapper } from '../mappers/prisma-ticket-mapper'
import { PAGINATION } from '@/core/config/pagination'

@Injectable()
export class PrismaTicketsRepository implements TicketsRepository {
  constructor(private prisma: PrismaService) {}

  findById(_id: string): Promise<Ticket> {
    throw new Error('Method not implemented.')
  }

  async findActiveTicketsByUserId(
    userId: string,
    pagination?: Pagination,
  ): Promise<Ticket[]> {
    const activeTickets = await this.prisma.ticket.findMany({
      where: {
        userId,
        result: null,
      },
      skip: pagination ? pagination.page - 1 : 0,
      take: pagination ? pagination.size : PAGINATION.size,
    })

    return activeTickets.map((t) => PrismaTicketMapper.toDomain(t))
  }

  async countNumberOfActiveTicketsByUserId(userId: string): Promise<number> {
    const numberOfActiveTickets = await this.prisma.ticket.count({
      where: {
        userId,
        result: null,
      },
    })

    return numberOfActiveTickets
  }

  async create(ticket: Ticket): Promise<void> {
    const data = PrismaTicketMapper.toPrisma(ticket)

    await this.prisma.ticket.create({
      data,
    })
  }

  async save(ticket: Ticket): Promise<void> {
    const data = PrismaTicketMapper.toPrisma(ticket)

    await this.prisma.ticket.update({
      data,
      where: {
        id: ticket.id.toString(),
      },
    })
  }
}
