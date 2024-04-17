import { Controller, Get } from '@nestjs/common'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user-decorator'
import { TicketsRepository } from '@/domain/repositories/tickets-repository'

@Controller('/tickets/count')
export class CountActiveTicketsController {
  constructor(private ticketsRepository: TicketsRepository) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub: userId } = user

    const count =
      await this.ticketsRepository.countNumberOfActiveTicketsByUserId(userId)

    return { count }
  }
}
