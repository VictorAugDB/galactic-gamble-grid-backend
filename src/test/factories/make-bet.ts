import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Bet, BetProps } from '@/domain/entities/bet'
import { sortBetNumbers } from '@/domain/helpers/sort-bet-numbers'

export function makeBet(override: Partial<BetProps> = {}, id?: UniqueEntityID) {
  const student = Bet.create(
    {
      userId: override.userId ?? new UniqueEntityID(),
      tickets: override.tickets ?? [],
      result: 'win',
      sortedNumbers: sortBetNumbers(),
      ...override,
    },
    id,
  )

  return student
}
