import { BetNumbersRewardMap } from '@/core/entities/types/bet-numbers-reward-map'
import { TicketNumbersCostMap } from '@/core/entities/types/ticket-numbers-cost-map'

export abstract class BetsRewardsRepository {
  abstract findMany(): Promise<BetNumbersRewardMap>
  abstract create(ticketNumbersCostMap: TicketNumbersCostMap): Promise<void>
  abstract update(key: number, val: number): Promise<void>
}
