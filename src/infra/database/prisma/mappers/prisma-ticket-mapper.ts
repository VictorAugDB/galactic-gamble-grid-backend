import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { BuyTicketTransaction } from '@/domain/entities/buy-ticket-transaction'
import { Ticket } from '@/domain/entities/ticket'
import { Prisma, Ticket as PrismaTicket, Transaction } from '@prisma/client'

export class PrismaTicketMapper {
  static toDomain(raw: PrismaTicket & { transaction: Transaction }): Ticket {
    return Ticket.create(
      {
        numbers: raw.numbers,
        userId: new UniqueEntityID(raw.userId),
        result:
          raw.result === 'LOSE' ? 'lose' : raw.result === 'WIN' ? 'win' : null,
        betId: raw.betId ? new UniqueEntityID(raw.betId) : undefined,
        transaction: BuyTicketTransaction.create({
          userId: new UniqueEntityID(raw.transaction.userId),
          value: raw.transaction.value,
          createdAt: raw.createdAt,
        }),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(ticket: Ticket): Prisma.TicketUncheckedCreateInput {
    return {
      userId: ticket.userId.toString(),
      betId: ticket.betId ? ticket.betId.toString() : undefined,
      createdAt: ticket.createdAt,
      numbers: ticket.numbers,
      result:
        ticket.result === 'lose'
          ? 'LOSE'
          : ticket.result === 'win'
            ? 'WIN'
            : null,
      transactionId: ticket.transaction.id.toString(),
      updatedAt: ticket.updatedAt,
    }
  }
}
