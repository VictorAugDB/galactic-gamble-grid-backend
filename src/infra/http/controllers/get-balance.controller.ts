import { Controller, Get, UsePipes } from '@nestjs/common'
import { GetBalanceUseCase } from '@/domain/usecases/get-balance'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user-decorator'

@Controller('/balance')
export class GetBalanceController {
  constructor(private getBalance: GetBalanceUseCase) {}

  @Get()
  @UsePipes()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub: userId } = user

    const userBalance = await this.getBalance.execute({ userId })

    return { balance: userBalance }
  }
}
