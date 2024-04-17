import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Bet } from '@/domain/entities/bet'
import { BetRewardTransaction } from '@/domain/entities/bet-reward-transaction'
import { BuyTicketTransaction } from '@/domain/entities/buy-ticket-transaction'
import { Ticket } from '@/domain/entities/ticket'
import {
  Prisma,
  Bet as PrismaBet,
  Ticket as PrismaTicket,
  Transaction,
} from '@prisma/client'

type BetWithTickets = PrismaBet & {
  tickets?: Array<
    PrismaTicket & {
      transaction: Transaction
    }
  >
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
                transaction: BuyTicketTransaction.create({
                  userId: new UniqueEntityID(t.transaction.userId),
                  value: t.transaction.value,
                  createdAt: t.createdAt,
                }),
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
        totalRewards: raw.totalRewards,
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
      totalRewards: bet.totalRewards,
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
