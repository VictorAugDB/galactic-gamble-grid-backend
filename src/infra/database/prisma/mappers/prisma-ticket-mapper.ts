import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Ticket } from '@/domain/entities/ticket'
import { Prisma, Ticket as PrismaTicket } from '@prisma/client'

export class PrismaTicketMapper {
  static toDomain(raw: PrismaTicket): Ticket {
    return Ticket.create(
      {
        numbers: raw.numbers,
        userId: new UniqueEntityID(raw.userId),
        result: raw.result === 'LOSE' ? 'lose' : 'win',
        betId: new UniqueEntityID(raw.betId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(ticket: Ticket): Prisma.TicketUncheckedCreateInput {
    console.log(ticket)

    return {
      userId: ticket.userId.toString(),
      betId: ticket.betId ? ticket.betId.toString() : undefined,
      createdAt: ticket.createdAt,
      numbers: ticket.numbers,
      result: ticket.result === 'lose' ? 'LOSE' : 'WIN',
      transactionId: ticket.transactionId.toString(),
      updatedAt: ticket.updatedAt,
    }
  }
}
