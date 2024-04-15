import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth.guard'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        return {
          signOptions: { expiresIn: '1d' },
          secret: env.get('SECRET'),
        }
      },
    }),
  ],
  providers: [
    EnvService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
