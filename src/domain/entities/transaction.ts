import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface TransactionProps {
  userId: UniqueEntityID
  referrerId: UniqueEntityID
  value: number
  type: 'buy-ticket' | 'reward' | 'add-money'
  createdAt: Date
}

export class Transaction extends Entity<TransactionProps> {
  get userId() {
    return this.props.userId
  }

  get referrerId() {
    return this.props.referrerId
  }

  get value() {
    return this.props.value
  }

  get type() {
    return this.props.type
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<TransactionProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Transaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
