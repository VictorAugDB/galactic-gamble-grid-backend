import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { BetsRepository } from '../repositories/bets-repository'
import { TicketsRepository } from '../repositories/tickets-repository'
import { sortBetNumbers } from '../helpers/sort-bet-numbers'
import { BetsRewardsRepository } from '../repositories/bets-rewards-repository'
import { BetRewardTransaction } from '../entities/bet-reward-transaction'
import { Bet } from '../entities/bet'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type SortBetUseCaseRequest = {
  userId: string
}

type SortBetUseCaseResponse = {
  winningTickets: Array<{
    id: string
    value: number
  }>
  sortedNumbers: number[]
}

export class SortBetUseCase {
  constructor(
    private betsRepository: BetsRepository,
    private ticketsRepository: TicketsRepository,
    private betsRewardsRepository: BetsRewardsRepository,
  ) {}

  async execute({
    userId,
  }: SortBetUseCaseRequest): Promise<SortBetUseCaseResponse> {
    const tickets =
      await this.ticketsRepository.findActiveTicketsByUserId(userId)

    if (!tickets.length) {
      throw new ResourceNotFoundError()
    }
    const numbersRewards = await this.betsRewardsRepository.findMany()
    const minNumbersToReward = Number(Object.keys(numbersRewards)[0])

    const sortedNumbers = sortBetNumbers()

    const winningTickets = tickets.flatMap((ticket) => {
      const numberOfMatches = sortedNumbers.reduce(
        (acc, curr) => (ticket.numbers[curr - 1] === 1 ? acc + 1 : acc),
        0,
      )

      if (numberOfMatches >= minNumbersToReward) {
        ticket.result = 'win'

        return [
          {
            id: ticket.id.toString(),
            value: numbersRewards[numberOfMatches],
          },
        ]
      }

      ticket.result = 'lose'

      return []
    })

    const bet = Bet.create({
      sortedNumbers,
      tickets,
      userId: new UniqueEntityID(userId),
    })

    const transactions = winningTickets.map((wt) =>
      BetRewardTransaction.create({
        bet,
        userId: new UniqueEntityID(userId),
        value: wt.value,
      }),
    )

    await this.betsRepository.create(bet, transactions)

    return { winningTickets, sortedNumbers }
  }
}
