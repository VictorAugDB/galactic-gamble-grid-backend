import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Ticket } from '../entities/ticket'
import { countTicketNumbers } from '../helpers/count-ticket-numbers'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { InsufficientBalanceError } from './errors/insufficient-balance'
import { BuyTicketTransaction } from '../entities/buy-ticket-transaction'
import { TicketsCostsRepository } from '../repositories/tickets-costs-repository'
import { Injectable } from '@nestjs/common'
import { TicketsRepository } from '../repositories/tickets-repository'
import { MAX_NUMBER_OF_ACTIVE_TICKETS } from '@/core/config/max-number-of-active-tickets'
import { TooManyActiveTicketsErrorError } from './errors/too-many-active-tickets'

type BuyTicketUseCaseRequest = {
  userId: string
  numbers: number[]
}

@Injectable()
export class BuyTicketUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private ticketsCostsRepository: TicketsCostsRepository,
    private ticketsRepository: TicketsRepository,
  ) {}

  async execute({ userId, numbers }: BuyTicketUseCaseRequest): Promise<void> {
    const userActiveTicketsCount =
      await this.ticketsRepository.countNumberOfActiveTicketsByUserId(userId)

    if (userActiveTicketsCount >= MAX_NUMBER_OF_ACTIVE_TICKETS) {
      throw new TooManyActiveTicketsErrorError()
    }

    const userBalance = await this.transactionsRepository.getUserBalance(userId)
    const ticketValue = await this.ticketsCostsRepository.findByKey(
      countTicketNumbers(numbers),
    )

    const userHasBalanceToBuyTheTicket = userBalance > ticketValue
    if (!userHasBalanceToBuyTheTicket) {
      throw new InsufficientBalanceError()
    }

    const transaction = BuyTicketTransaction.create({
      userId: new UniqueEntityID(userId),
      value: ticketValue,
    })

    const ticket = Ticket.create({
      numbers,
      userId: new UniqueEntityID(userId),
      transaction,
    })

    transaction.ticket = ticket

    await this.transactionsRepository.create(transaction)
  }
}
