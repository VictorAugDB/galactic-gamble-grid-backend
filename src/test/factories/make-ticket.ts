import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Ticket, TicketProps } from '@/domain/entities/ticket'

export function makeTicketNumbers() {
  // generate min 15 max 20 numbers
  return [
    ...Array.from(
      {
        length: 15,
      },
      () => 1,
    ),
    ...Array.from(
      {
        length: 5,
      },
      () => Math.floor(Math.random() * 2),
    ),
    ...Array.from(
      {
        length: 5,
      },
      () => 0,
    ),
  ]
}

export function makeTicket(
  override: Partial<TicketProps> = {},
  id?: UniqueEntityID,
) {
  const ticket = Ticket.create(
    {
      numbers: makeTicketNumbers(),
      userId: override.userId ?? new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return ticket
}
