import { Controller, Get } from '@nestjs/common'
import { TicketsCostsRepository } from '@/domain/repositories/tickets-costs-repository'
import { Public } from '@/infra/auth/public-decorator'

@Controller('/config/tickets-costs')
export class GetTicketsCostsController {
  constructor(private ticketsCostsRepository: TicketsCostsRepository) {}

  @Public()
  @Get()
  async handle() {
    const ticketsCosts = await this.ticketsCostsRepository.findMany()

    return { ticketsCosts }
  }
}
