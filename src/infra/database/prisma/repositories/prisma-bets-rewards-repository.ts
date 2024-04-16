import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TicketNumbersCostMap } from '@/core/entities/types/ticket-numbers-cost-map'
import { BetsRewardsRepository } from '@/domain/repositories/bets-rewards-repository'
import { BetNumbersRewardMap } from '@/core/entities/types/bet-numbers-reward-map'

@Injectable()
export class PrismaBetsRewardsRepository implements BetsRewardsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(): Promise<BetNumbersRewardMap> {
    const result = await this.prisma.betReward.findMany()

    const betsRewardsCosts = result[0]
      .numbersRewards as BetNumbersRewardMap | null

    if (!betsRewardsCosts) {
      throw new NotFoundException('Bets Rewards not found!')
    }

    return betsRewardsCosts
  }

  create(_ticketNumbersCostMap: TicketNumbersCostMap): Promise<void> {
    throw new Error('Method not implemented.')
  }

  update(_key: number, _val: number): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
