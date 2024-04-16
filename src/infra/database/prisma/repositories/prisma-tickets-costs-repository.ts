import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TicketsCostsRepository } from '@/domain/repositories/tickets-costs-repository'
import { TicketNumbersCostMap } from '@/core/entities/types/ticket-numbers-cost-map'

@Injectable()
export class PrismaTicketsCostsRepository implements TicketsCostsRepository {
  constructor(private prisma: PrismaService) {}

  async findByKey(key: number): Promise<number> {
    const result = await this.prisma.ticketCost.findMany()

    const ticketsNumbersCosts = result[0].numbersCosts

    if (!ticketsNumbersCosts) {
      throw new NotFoundException('Tickets costs not found!')
    }

    return ticketsNumbersCosts[key]
  }

  create(_ticketNumbersCostMap: TicketNumbersCostMap): Promise<void> {
    throw new Error('Method not implemented.')
  }

  update(_key: number, _val: number): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
