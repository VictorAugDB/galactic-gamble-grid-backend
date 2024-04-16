import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Bet } from '@/domain/entities/bet'
import { BetRewardTransaction } from '@/domain/entities/bet-reward-transaction'
import { Ticket } from '@/domain/entities/ticket'
import {
  Prisma,
  Bet as PrismaBet,
  Ticket as PrismaTicket,
} from '@prisma/client'

type BetWithTickets = PrismaBet & {
  tickets?: PrismaTicket[]
}

export class PrismaBetMapper {
  static toDomain(raw: BetWithTickets): Bet {
    return Bet.create(
      {
        sortedNumbers: raw.sortedNumbers,
        tickets: raw.tickets
          ? raw.tickets.map((t) =>
              Ticket.create({
                numbers: t.numbers,
                userId: new UniqueEntityID(t.userId),
                createdAt: t.createdAt,
                transactionId: new UniqueEntityID(t.transactionId),
                result:
                  t.result === 'LOSE'
                    ? 'lose'
                    : t.result === 'WIN'
                      ? 'win'
                      : null,
                updatedAt: t.updatedAt,
              }),
            )
          : [],
        userId: new UniqueEntityID(raw.userId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    bet: Bet,
    transactions: BetRewardTransaction[],
  ): Prisma.BetUncheckedCreateInput {
    return {
      userId: bet.userId.toString(),
      createdAt: bet.createdAt,
      sortedNumbers: bet.sortedNumbers,
      transactions: transactions.length
        ? {
            createMany: {
              data: transactions.map((t) => ({
                type: 'REWARD',
                userId: t.userId.toString(),
                value: t.value,
                createdAt: t.createdAt,
              })),
            },
          }
        : undefined,
    }
  }
}
