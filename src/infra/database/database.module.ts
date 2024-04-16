import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { TransactionsRepository } from '@/domain/repositories/transactions-repository'
import { TicketsCostsRepository } from '@/domain/repositories/tickets-costs-repository'
import { PrismaTransactionsRepository } from './prisma/repositories/prisma-transactions-repository'
import { PrismaTicketsCostsRepository } from './prisma/repositories/prisma-tickets-costs-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { TicketsRepository } from '@/domain/repositories/tickets-repository'
import { PrismaTicketsRepository } from './prisma/repositories/prisma-tickets.repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: TransactionsRepository,
      useClass: PrismaTransactionsRepository,
    },
    {
      provide: TicketsCostsRepository,
      useClass: PrismaTicketsCostsRepository,
    },
    {
      provide: TicketsRepository,
      useClass: PrismaTicketsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    TransactionsRepository,
    TicketsCostsRepository,
    TicketsRepository,
  ],
})
export class DatabaseModule {}
