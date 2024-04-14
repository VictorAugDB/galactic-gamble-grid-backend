import { BetNumbersRewardMap } from '@/core/entities/types/bet-numbers-reward-map'
import { BetsRewardsRepository } from '@/domain/repositories/bets-rewards-repository'
import { BETS_REWARDS } from '../config/bets-rewards'

export class InMemoryBetsRewardsRepository implements BetsRewardsRepository {
  public items: BetNumbersRewardMap = BETS_REWARDS

  findMany(): Promise<BetNumbersRewardMap> {
    return Promise.resolve(this.items)
  }

  create(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  update(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
