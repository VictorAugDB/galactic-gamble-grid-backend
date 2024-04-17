import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Bet } from '@/domain/entities/bet'
import { BetRewardTransaction } from '@/domain/entities/bet-reward-transaction'
import { BuyTicketTransaction } from '@/domain/entities/buy-ticket-transaction'
import { Ticket } from '@/domain/entities/ticket'
import {
  Bet as PrismaBet,
  Prisma,
  Transaction,
  Ticket as PrismaTicket,
} from '@prisma/client'

type TransactionWithTicket = Transaction & {
  bet?: PrismaBet & {
    tickets: Array<
      PrismaTicket & {
        transaction: Transaction
      }
    >
  }
}

export class PrismaBetRewardTransactionMapper {
  static toDomain(raw: TransactionWithTicket): BetRewardTransaction {
    return BetRewardTransaction.create(
      {
        userId: new UniqueEntityID(raw.userId),
        value: raw.value,
        bet: raw.bet
          ? Bet.create({
              sortedNumbers: raw.bet.sortedNumbers,
              totalRewards: raw.bet.totalRewards,
              tickets: raw.bet.tickets.map((t) =>
                Ticket.create({
                  numbers: t.numbers,
                  userId: new UniqueEntityID(t.userId),
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
                  createdAt: t.createdAt,
                  updatedAt: t.updatedAt,
                }),
              ),
              userId: new UniqueEntityID(raw.bet.userId),
            })
          : undefined,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    transaction: BetRewardTransaction,
  ): Prisma.TransactionUncheckedCreateInput {
    return {
      type: 'REWARD',
      betId: transaction.bet ? transaction.bet.id.toString() : undefined,
      userId: transaction.userId.toString(),
      value: transaction.value,
      createdAt: transaction.createdAt,
    }
  }
}
