import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AddMoneyTransaction } from '../entities/add-money-transaction'
import { TransactionsRepository } from '../repositories/transactions-repository'

type AddMoneyUseCaseRequest = {
  userId: string
  value: number
}

export class AddMoneyUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ userId, value }: AddMoneyUseCaseRequest): Promise<void> {
    const transaction = AddMoneyTransaction.create({
      userId: new UniqueEntityID(userId),
      value,
    })

    await this.transactionsRepository.create(transaction)
  }
}
