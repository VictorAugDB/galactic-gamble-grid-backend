import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { BuyTicketTransaction } from '@/domain/entities/buy-ticket-transaction'
import { Ticket } from '@/domain/entities/ticket'
import { Prisma, Ticket as PrismaTicket, Transaction } from '@prisma/client'

type TransactionWithTicket = Transaction & {
  ticket?: PrismaTicket
}

export class PrismaBuyTicketTransactionMapper {
  static toDomain(raw: TransactionWithTicket): BuyTicketTransaction {
    return BuyTicketTransaction.create(
      {
        userId: new UniqueEntityID(raw.userId),
        value: raw.value,
        ticket: raw.ticket
          ? Ticket.create({
              numbers: raw.ticket.numbers,
              userId: new UniqueEntityID(raw.ticket.userId),
              createdAt: raw.ticket.createdAt,
              result: raw.ticket.result === 'LOSE' ? 'lose' : 'win',
              updatedAt: raw.ticket.updatedAt,
            })
          : null,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    transaction: BuyTicketTransaction,
  ): Prisma.TransactionUncheckedCreateInput {
    return {
      type: 'BUY_TICKET',
      userId: transaction.userId.toString(),
      ticket: {
        create: {
          userId: transaction.ticket.userId.toString(),
          createdAt: transaction.ticket.createdAt,
          numbers: transaction.ticket.numbers,
          result: transaction.ticket.result === 'lose' ? 'LOSE' : 'WIN',
          updatedAt: transaction.ticket.updatedAt,
        },
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    }
  }
}
