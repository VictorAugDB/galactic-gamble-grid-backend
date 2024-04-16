import { Controller, Post } from '@nestjs/common'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user-decorator'
import { SortBetUseCase } from '@/domain/usecases/sort-bet'

@Controller('/bets')
export class SortBetController {
  constructor(private sortBet: SortBetUseCase) {}

  @Post()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub: userId } = user

    const { sortedNumbers, winningTickets } = await this.sortBet.execute({
      userId,
    })

    return {
      sortedNumbers,
      winningTickets,
    }
  }
}
