import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface TicketProps {
  userId: UniqueEntityID
  betId?: string
  numbers: number[]
  result: 'win' | 'lose' | null
  createdAt: Date
  updatedAt: Date
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

  set result(result: TicketProps['result']) {
    this.props.result = result
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<TicketProps, 'createdAt' | 'updatedAt' | 'result'>,
    id?: UniqueEntityID,
  ) {
    return new Ticket(
      {
        ...props,
        result: props.result ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
  }
}
