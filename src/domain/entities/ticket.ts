import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface TicketProps {
  userId: UniqueEntityID
  betId: string
  numbers: number[]
  active: boolean
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

  get active() {
    return this.props.active
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<TicketProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Ticket(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
