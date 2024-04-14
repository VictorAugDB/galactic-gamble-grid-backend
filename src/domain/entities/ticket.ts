import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface TicketProps {
  userId: UniqueEntityID
  betId?: string
  numbers: number[]
  result: 'win' | 'lose' | null
  createdAt: Date
}

export class Ticket extends Entity<TicketProps> {
  get userId() {
    return this.props.userId
  }

  get betId() {
    return this.props.betId
  }

  get numbers() {
    return this.props.numbers
  }

  get result() {
    return this.props.result
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<TicketProps, 'createdAt' | 'result'>,
    id?: UniqueEntityID,
  ) {
    return new Ticket(
      {
        ...props,
        result: props.result ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
