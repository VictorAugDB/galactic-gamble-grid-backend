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

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [
    SignUpController,
    BuyTicketController,
    AuthenticateUserController,
  ],
  providers: [SignUpUserUseCase, AuthenticateUserUseCase, BuyTicketUseCase],
})
export class HttpModule {}
