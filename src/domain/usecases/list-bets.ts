import { Pagination } from '@/core/entities/types/pagination'
import { Bet } from '../entities/bet'
import { BetsRepository } from '../repositories/bets-repository'
import { PAGINATION } from '@/core/config/pagination'
import { Injectable } from '@nestjs/common'

type ListBetsUseCaseRequest = {
  userId: string
  pagination?: Pagination
}

@Injectable()
export class ListBetsUseCase {
  constructor(private betsRepository: BetsRepository) {}

  async execute({
    userId,
    pagination = PAGINATION,
  }: ListBetsUseCaseRequest): Promise<Bet[]> {
    const bets = await this.betsRepository.findManyByUserId(userId, pagination)

    return bets
  }
}
