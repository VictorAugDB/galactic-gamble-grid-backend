import { InMemoryTransactionsRepository } from '@/test/repositories/in-memory-transactions-repository'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { makeUser } from '@/test/factories/make-user'
import { InMemoryBetsRepository } from '@/test/repositories/in-memory-bets-repository'
import { InMemoryTicketsRepository } from '@/test/repositories/in-memory-tickets-repository'
import { ListBetsUseCase } from './list-bets'
import { Bet } from '../entities/bet'
import { sortBetNumbers } from '../helpers/sort-bet-numbers'
import { PAGINATION } from '@/core/config/pagination'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryBetsRepository: InMemoryBetsRepository
let sut: ListBetsUseCase

describe('Get Balance', () => {
  beforeEach(() => {
    const inMemoryTicketsRepository = new InMemoryTicketsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryBetsRepository = new InMemoryBetsRepository(
      inMemoryTicketsRepository,
      new InMemoryTransactionsRepository(inMemoryTicketsRepository),
    )

    sut = new ListBetsUseCase(inMemoryBetsRepository)
  })

  it('should be able to get balance', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)
    const bets = Array.from({ length: 10 }).map((_) =>
      Bet.create({
        sortedNumbers: sortBetNumbers(),
        tickets: [],
        userId: user.id,
      }),
    )
    await Promise.all(bets.map((bet) => inMemoryBetsRepository.create(bet, [])))

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result).toEqual(bets)
  })

  it('should be able to call find with pagination', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

    const findManyByUserIdSpy = vitest.spyOn(
      inMemoryBetsRepository,
      'findManyByUserId',
    )

    await sut.execute({
      userId: user.id.toString(),
      pagination: PAGINATION,
    })

    expect(findManyByUserIdSpy).toHaveBeenCalledWith(
      user.id.toString(),
      expect.objectContaining(PAGINATION),
    )
  })
})
