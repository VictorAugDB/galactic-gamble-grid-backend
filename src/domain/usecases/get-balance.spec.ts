import { InMemoryTransactionsRepository } from '@/test/repositories/in-memory-transactions-repository'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { makeUser } from '@/test/factories/make-user'
import { AddMoneyTransaction } from '../entities/add-money-transaction'
import { BuyTicketTransaction } from '../entities/buy-ticket-transaction'
import { InMemoryTicketsRepository } from '@/test/repositories/in-memory-tickets-repository'
import { GetBalanceUseCase } from './get-balance'
import { BetRewardTransaction } from '../entities/bet-reward-transaction'
import { makeTicket } from '@/test/factories/make-ticket'
import { makeBet } from '@/test/factories/make-bet'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: GetBalanceUseCase

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository(
      new InMemoryTicketsRepository(),
    )

    sut = new GetBalanceUseCase(inMemoryTransactionsRepository)
  })

  it('should be able to get balance', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)
    await inMemoryTransactionsRepository.create(
      AddMoneyTransaction.create({
        userId: user.id,
        value: 50000,
      }),
    )
    await inMemoryTransactionsRepository.create(
      BetRewardTransaction.create({
        userId: user.id,
        bet: makeBet(),
        value: 10,
      }),
    )
    await inMemoryTransactionsRepository.create(
      BuyTicketTransaction.create({
        userId: user.id,
        ticket: makeTicket({}),
        value: 1,
      }),
    )

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result).toBe(50009)
  })
})
