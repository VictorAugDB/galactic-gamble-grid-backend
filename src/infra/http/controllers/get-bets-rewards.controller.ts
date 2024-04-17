import { Controller, Get } from '@nestjs/common'
import { Public } from '@/infra/auth/public-decorator'
import { BetsRewardsRepository } from '@/domain/repositories/bets-rewards-repository'

@Controller('/config/bets-rewards')
export class GetBetsRewardsController {
  constructor(private betsRewardsRepository: BetsRewardsRepository) {}

  @Public()
  @Get()
  async handle() {
    const betsRewards = await this.betsRewardsRepository.findMany()

    return { betsRewards }
  }
}
