import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { TransactionsRepository } from '@/domain/repositories/transactions-repository'
import { TicketsCostsRepository } from '@/domain/repositories/tickets-costs-repository'
import { PrismaTransactionsRepository } from './prisma/repositories/prisma-transactions-repository'
import { PrismaTicketsCostsRepository } from './prisma/repositories/prisma-tickets-costs-repository'

@Module({
  imports: [],
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
  ],
  exports: [
    PrismaService,
    UsersRepository,
    TransactionsRepository,
    TicketsCostsRepository,
  ],
})
export class DatabaseModule {}
