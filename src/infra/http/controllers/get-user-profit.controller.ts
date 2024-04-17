import { Controller, Get } from '@nestjs/common'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user-decorator'
import { BetsRepository } from '@/domain/repositories/bets-repository'

@Controller('/profit')
export class GetUserProfitController {
  constructor(private betsRepository: BetsRepository) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub: userId } = user

    const profit = await this.betsRepository.calculateUserProfit(userId)

    return { profit }
  }
}
