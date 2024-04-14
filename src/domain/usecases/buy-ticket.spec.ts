import { BuyTicketUseCase } from './buy-ticket'
import { InMemoryTransactionsRepository } from '@/test/repositories/in-memory-transactions-repository'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { makeUser } from '@/test/factories/make-user'
import { InMemoryTicketsRepository } from '@/test/repositories/in-memory-tickets-repository'
import { InMemoryTicketsCostsRepository } from '@/test/repositories/in-memory-tickets-costs-repository'
import { countTicketNumbers } from '../helpers/count-ticket-numbers'
import { makeTicketNumbers } from '@/test/factories/make-ticket'
import { InsufficientBalanceError } from './errors/insufficient-balance'
import { AddMoneyTransaction } from '../entities/add-money-transaction'
import { BuyTicketTransaction } from '../entities/buy-ticket-transaction'

let inMemoryTicketsCostsRepository: InMemoryTicketsCostsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTicketsRepository: InMemoryTicketsRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: BuyTicketUseCase

describe('Buy Ticket', () => {
  beforeEach(() => {
    inMemoryTicketsCostsRepository = new InMemoryTicketsCostsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryTicketsRepository = new InMemoryTicketsRepository()
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository(
      inMemoryTicketsRepository,
    )

    sut = new BuyTicketUseCase(
      inMemoryTransactionsRepository,
      inMemoryTicketsCostsRepository,
    )
  })

  it('should be able to buy ticket', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)
    await inMemoryTransactionsRepository.create(
      AddMoneyTransaction.create({
        userId: user.id,
        value: 50000,
      }),
    )

    const numbers = makeTicketNumbers()

    await sut.execute({
      numbers,
      userId: user.id.toString(),
    })

    const numberAmount = countTicketNumbers(numbers)
    const ticketValue =
      await inMemoryTicketsCostsRepository.findByKey(numberAmount)

    expect(inMemoryTicketsRepository.items[0]).toEqual(
      expect.objectContaining({
        userId: user.id,
        numbers,
        active: true,
      }),
    )
    expect(inMemoryTransactionsRepository.items[1]).toBeInstanceOf(
      BuyTicketTransaction,
    )
    expect(inMemoryTransactionsRepository.items[1]).toEqual(
      expect.objectContaining({
        userId: user.id,
        value: ticketValue,
      }),
    )
  })

  it('should be able to throw if user do not have balance', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)
    await inMemoryTransactionsRepository.create(
      AddMoneyTransaction.create({
        userId: user.id,
        value: 3000,
      }),
    )

    expect(
      sut.execute({
        numbers: [...Array.from({ length: 20 }, () => 1), 0, 0, 0, 0, 0],
        userId: user.id.toString(),
      }),
    ).rejects.toBeInstanceOf(InsufficientBalanceError)
  })
})
