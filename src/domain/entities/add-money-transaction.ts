import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AddMoneyTransactionProps {
  userId: UniqueEntityID
  value: number
  createdAt: Date
}

export class AddMoneyTransaction extends Entity<AddMoneyTransactionProps> {
  get userId() {
    return this.props.userId
  }

  get value() {
    return this.props.value
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<AddMoneyTransactionProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new AddMoneyTransaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
