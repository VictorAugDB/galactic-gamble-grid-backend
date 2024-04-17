import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { InMemoryTicketsRepository } from '@/test/repositories/in-memory-tickets-repository'
import { SortBetUseCase } from './sort-bet'
import { InMemoryBetsRepository } from '@/test/repositories/in-memory-bets-repository'
import { InMemoryTransactionsRepository } from '@/test/repositories/in-memory-transactions-repository'
import { makeUser } from '@/test/factories/make-user'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeTicket, makeTicketNumbers } from '@/test/factories/make-ticket'
import { BetRewardTransaction } from '../entities/bet-reward-transaction'
import { InMemoryBetsRewardsRepository } from '@/test/repositories/in-memory-bets-rewards-repository'
import { BETS_REWARDS } from '@/test/config/bets-rewards'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryBetsRepository: InMemoryBetsRepository
let inMemoryTicketsRepository: InMemoryTicketsRepository
let sut: SortBetUseCase

const sortedNumbers = Array.from({ length: 15 }, (_, i) => i + 1)

vitest.mock('../helpers/sort-bet-numbers', () => ({
  sortBetNumbers: vi.fn(() => Array.from({ length: 15 }, (_, i) => i + 1)),
}))

describe('Sort Bet', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryTicketsRepository = new InMemoryTicketsRepository()
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository(
      inMemoryTicketsRepository,
    )
    inMemoryBetsRepository = new InMemoryBetsRepository(
      inMemoryTicketsRepository,
      inMemoryTransactionsRepository,
    )

    sut = new SortBetUseCase(
      inMemoryBetsRepository,
      inMemoryTicketsRepository,
      new InMemoryBetsRewardsRepository(),
    )
  })

  it('should be able to sort a bet', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)
    const ticket = makeTicket({
      numbers: makeTicketNumbers(false),
      userId: user.id,
    })

    await inMemoryTicketsRepository.create(ticket)

    const result = await sut.execute({ userId: user.id.toString() })

    expect(inMemoryTicketsRepository.items[0]).toEqual(
      expect.objectContaining({
        result: 'win',
        betId: expect.any(UniqueEntityID),
      }),
    )

    expect(inMemoryTransactionsRepository.items[0]).toBeInstanceOf(
      BetRewardTransaction,
    )
    expect(inMemoryTransactionsRepository.items[0]).toEqual(
      expect.objectContaining({
        value: BETS_REWARDS[15],
      }),
    )
    expect(inMemoryBetsRepository.items[0]).toEqual(
      expect.objectContaining({
        userId: user.id,
        sortedNumbers,
        totalRewards: BETS_REWARDS[15],
      }),
    )
    expect(result).toEqual({
      winningTickets: [
        {
          id: ticket.id.toString(),
          value: BETS_REWARDS[15],
          numbers: expect.any(Array),
        },
      ],
      sortedNumbers,
      betId: expect.any(String),
    })
  })

  it('should be able to sort a bet with multiple tickets', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)
    const winningTickets = [
      makeTicket({
        numbers: makeTicketNumbers(true),
        userId: user.id,
      }),
      makeTicket({
        numbers: makeTicketNumbers(true, 1),
        userId: user.id,
      }),
      makeTicket({
        numbers: makeTicketNumbers(true, 2),
        userId: user.id,
      }),
      makeTicket({
        numbers: makeTicketNumbers(true, 3),
        userId: user.id,
      }),
    ]
    const tickets = [
      ...Array.from({ length: 5 }).map((_) =>
        makeTicket({
          numbers: Array.from({ length: 25 }, () => 0),
          userId: user.id,
        }),
      ),
      ...winningTickets,
    ]

    await Promise.all(
      tickets.map((ticket) => inMemoryTicketsRepository.create(ticket)),
    )

    const result = await sut.execute({ userId: user.id.toString() })

    expect(
      inMemoryTicketsRepository.items.filter((t) => t.result === 'lose'),
    ).toHaveLength(5)
    expect(
      inMemoryTicketsRepository.items.filter((t) => t.result === 'win'),
    ).toHaveLength(4)

    expect(inMemoryTransactionsRepository.items).toHaveLength(4)

    expect(inMemoryBetsRepository.items[0]).toEqual(
      expect.objectContaining({
        totalRewards:
          BETS_REWARDS[15] +
          BETS_REWARDS[14] +
          BETS_REWARDS[13] +
          BETS_REWARDS[12],
      }),
    )

    expect(result).toEqual({
      winningTickets: winningTickets.map((wt) => ({
        id: wt.id.toString(),
        value:
          BETS_REWARDS[
            wt.numbers.reduce((acc, curr) => (curr === 1 ? acc + 1 : acc), 0)
          ],
        numbers: expect.any(Array),
      })),
      sortedNumbers,
      betId: expect.any(String),
    })
  })

  it('should be able to throw if user does not have tickets', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

    expect(sut.execute({ userId: user.id.toString() })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
