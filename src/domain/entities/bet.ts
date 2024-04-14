import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Ticket } from './ticket'

export interface BetProps {
  userId: UniqueEntityID
  tickets: Ticket[]
  sortedNumbers: number[]
  result: 'win' | 'lose'
  createdAt: Date
}

export class Bet extends Entity<BetProps> {
  get userId() {
    return this.props.userId
  }

  get tickets() {
    return this.props.tickets
  }

  get sortedNumbers() {
    return this.props.sortedNumbers
  }

  get result() {
    return this.props.result
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: Optional<BetProps, 'createdAt'>, id?: UniqueEntityID) {
    return new Bet(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
