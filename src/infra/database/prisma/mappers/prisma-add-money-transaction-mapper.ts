import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AddMoneyTransaction } from '@/domain/entities/add-money-transaction'
import { Prisma, Transaction } from '@prisma/client'

export class PrismaAddMoneyTransactionMapper {
  static toDomain(raw: Transaction): AddMoneyTransaction {
    return AddMoneyTransaction.create(
      {
        userId: new UniqueEntityID(raw.userId),
        value: raw.value,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    transaction: AddMoneyTransaction,
  ): Prisma.TransactionUncheckedCreateInput {
    return {
      type: 'ADD_MONEY',
      userId: transaction.userId.toString(),
      value: transaction.value,
      createdAt: transaction.createdAt,
    }
  }
}
