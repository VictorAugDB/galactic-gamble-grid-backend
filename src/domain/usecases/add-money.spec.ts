import { InMemoryTransactionsRepository } from '@/test/repositories/in-memory-transactions-repository'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { makeUser } from '@/test/factories/make-user'
import { InMemoryTicketsRepository } from '@/test/repositories/in-memory-tickets-repository'
import { AddMoneyUseCase } from './add-money'
import { faker } from '@faker-js/faker'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: AddMoneyUseCase

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository(
      new InMemoryTicketsRepository(),
    )

    sut = new AddMoneyUseCase(inMemoryTransactionsRepository)
  })

  it('should be able to add money', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)
    const value = faker.number.int({
      min: 50000,
      max: 1000000,
    })

    await sut.execute({
      userId: user.id.toString(),
      value,
    })

    expect(inMemoryTransactionsRepository.items[0]).toEqual(
      expect.objectContaining({
        userId: user.id,
        value,
      }),
    )
  })
})
