import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { BuyTicketTransaction } from '@/domain/entities/buy-ticket-transaction'
import { Ticket, TicketProps } from '@/domain/entities/ticket'

export function makeTicketNumbers(
  min: boolean = true,
  subtracticMatches: 0 | 1 | 2 | 3 | 4 | 5 = 0,
) {
  // generate min 15 max 20 numbers
  return [
    ...Array.from(
      {
        length: 15 - subtracticMatches,
      },
      () => 1,
    ),
    ...Array.from(
      {
        length: 5,
      },
      () => (min ? 0 : Math.floor(Math.random() * 2)),
    ),
    ...Array.from(
      {
        length: 5 + subtracticMatches,
      },
      () => 0,
    ),
  ]
}

export function makeTicket(
  override: Partial<TicketProps> = {},
  id?: UniqueEntityID,
) {
  const userId = override.userId ?? new UniqueEntityID()

  const ticket = Ticket.create(
    {
      numbers: makeTicketNumbers(),
      userId,
      transaction:
        override.transaction ??
        BuyTicketTransaction.create({
          userId,
          value: 5000,
        }),
      ...override,
    },
    id,
  )

  return ticket
}
