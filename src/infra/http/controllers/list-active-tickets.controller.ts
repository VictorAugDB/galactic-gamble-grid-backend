import { Controller, Get } from '@nestjs/common'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user-decorator'
import { ListActiveTicketsUseCase } from '@/domain/usecases/list-active-tickets'
import { TicketsPresenter } from '../presenters/tickets-presenter'
import { MAX_NUMBER_OF_ACTIVE_TICKETS } from '@/core/config/max-number-of-active-tickets'

@Controller('/tickets')
export class ListActiveTicketsController {
  constructor(private listActiveTickets: ListActiveTicketsUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub: userId } = user

    const tickets = await this.listActiveTickets.execute({
      userId,
      pagination: {
        page: 1,
        size: MAX_NUMBER_OF_ACTIVE_TICKETS,
      },
    })

    return { tickets: tickets.map((t) => TicketsPresenter.toHTTP(t)) }
  }
}
