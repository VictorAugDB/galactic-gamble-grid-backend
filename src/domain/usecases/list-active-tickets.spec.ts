import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { makeUser } from '@/test/factories/make-user'
import { InMemoryTicketsRepository } from '@/test/repositories/in-memory-tickets-repository'
import { PAGINATION } from '@/core/config/pagination'
import { ListTicketsUseCase } from './list-active-tickets'
import { makeTicket } from '@/test/factories/make-ticket'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTicketsRepository: InMemoryTicketsRepository
let sut: ListTicketsUseCase

describe('List Active Tickets', () => {
  beforeEach(() => {
    inMemoryTicketsRepository = new InMemoryTicketsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new ListTicketsUseCase(inMemoryTicketsRepository)
  })

  it('should be able to list active tickets', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)
    const tickets = Array.from({ length: 10 }).map((_) =>
      makeTicket({
        userId: user.id,
      }),
    )
    await Promise.all(
      tickets.map((ticket) => inMemoryTicketsRepository.create(ticket)),
    )

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result).toEqual(tickets)
  })

  it('should be able to call find with pagination', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

    const findManyByUserIdSpy = vitest.spyOn(
      inMemoryTicketsRepository,
      'findActiveTicketsByUserId',
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
