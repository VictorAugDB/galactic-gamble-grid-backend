import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Bet } from '@/domain/entities/bet'
import { BetRewardTransaction } from '@/domain/entities/bet-reward-transaction'
import { Ticket } from '@/domain/entities/ticket'
import {
  Bet as PrismaBet,
  Prisma,
  Transaction,
  Ticket as PrismaTicket,
} from '@prisma/client'

type TransactionWithTicket = Transaction & {
  bet?: PrismaBet & {
    tickets: PrismaTicket[]
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
              tickets: raw.bet.tickets.map((t) =>
                Ticket.create({
                  numbers: t.numbers,
                  userId: new UniqueEntityID(t.userId),
                  result: t.result === 'LOSE' ? 'lose' : 'win',
                  createdAt: t.createdAt,
                  updatedAt: t.updatedAt,
                }),
              ),
              userId: new UniqueEntityID(raw.bet.userId),
            })
          : null,
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
      betId: transaction.bet.id.toString(),
      userId: transaction.userId.toString(),
      value: transaction.value,
      createdAt: transaction.createdAt,
    }
  }
}
