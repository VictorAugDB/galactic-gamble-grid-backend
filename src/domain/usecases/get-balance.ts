import { Injectable } from '@nestjs/common'
import { TransactionsRepository } from '../repositories/transactions-repository'

type GetBalanceUseCaseRequest = {
  userId: string
}

@Injectable()
export class GetBalanceUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ userId }: GetBalanceUseCaseRequest): Promise<number> {
    const userBalance = await this.transactionsRepository.getUserBalance(userId)

    return userBalance
  }
}
