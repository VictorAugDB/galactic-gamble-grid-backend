import { Module } from '@nestjs/common'
import { SignUpController } from './controllers/sign-up.controller'
import { DatabaseModule } from '../database/database.module'
import { SignUpUserUseCase } from '@/domain/usecases/sign-up-user'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { BuyTicketController } from './controllers/buy-ticket.controller'
import { EnvModule } from '../env/env.module'
import { AuthenticateUserUseCase } from '@/domain/usecases/authenticate-user'
import { AuthenticateUserController } from './controllers/authenticate-user.controller'
import { BuyTicketUseCase } from '@/domain/usecases/buy-ticket'
import { AddMoneyController } from './controllers/add-money.controller'
import { AddMoneyUseCase } from '@/domain/usecases/add-money'
import { GetBalanceController } from './controllers/get-balance.controller'
import { GetBalanceUseCase } from '@/domain/usecases/get-balance'
import { ListActiveTicketsController } from './controllers/list-active-tickets.controller'
import { ListActiveTicketsUseCase } from '@/domain/usecases/list-active-tickets'

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [
    SignUpController,
    BuyTicketController,
    AuthenticateUserController,
    AddMoneyController,
    GetBalanceController,
    ListActiveTicketsController,
  ],
  providers: [
    SignUpUserUseCase,
    AuthenticateUserUseCase,
    BuyTicketUseCase,
    AddMoneyUseCase,
    GetBalanceUseCase,
    ListActiveTicketsUseCase,
  ],
})
export class HttpModule {}
