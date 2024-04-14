import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Ticket } from './ticket'

export interface BuyTicketTransactionProps {
  userId: UniqueEntityID
  ticket: Ticket
  value: number
  createdAt: Date
}

export class BuyTicketTransaction extends Entity<BuyTicketTransactionProps> {
  get userId() {
    return this.props.userId
  }

  get ticket() {
    return this.props.ticket
  }

  get value() {
    return this.props.value
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<BuyTicketTransactionProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new BuyTicketTransaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
