import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Bet } from './bet'

export interface BetRewardTransactionProps {
  userId: UniqueEntityID
  bet?: Bet
  value: number
  createdAt: Date
}

export class BetRewardTransaction extends Entity<BetRewardTransactionProps> {
  get userId() {
    return this.props.userId
  }

  get bet() {
    return this.props.bet
  }

  get value() {
    return this.props.value
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<BetRewardTransactionProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new BetRewardTransaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
