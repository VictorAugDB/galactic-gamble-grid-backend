import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Ticket } from '../entities/ticket'
import { countTicketNumbers } from '../helpers/count-ticket-numbers'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { InsufficientBalanceError } from './errors/insufficient-balance'
import { BuyTicketTransaction } from '../entities/buy-ticket-transaction'
import { TicketsCostsRepository } from '../repositories/tickets-costs-repository'
import { Injectable } from '@nestjs/common'

type BuyTicketUseCaseRequest = {
  userId: string
  numbers: number[]
}

@Injectable()
export class BuyTicketUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private ticketsCostsRepository: TicketsCostsRepository,
  ) {}

  async execute({ userId, numbers }: BuyTicketUseCaseRequest): Promise<void> {
    const userBalance = await this.transactionsRepository.getUserBalance(userId)
    const ticketValue = await this.ticketsCostsRepository.findByKey(
      countTicketNumbers(numbers),
    )

    const userHasBalanceToBuyTheTicket = userBalance > ticketValue
    if (!userHasBalanceToBuyTheTicket) {
      throw new InsufficientBalanceError()
    }

    const ticket = Ticket.create({
      numbers,
      userId: new UniqueEntityID(userId),
    })

    const transaction = BuyTicketTransaction.create({
      userId: new UniqueEntityID(userId),
      value: ticketValue,
      ticket,
    })

    await this.transactionsRepository.create(transaction)
  }
}
