import { Module } from '@nestjs/common'
import { CacheRepository } from './cache-repository'
import { RedisCacheRepository } from './redis/redis-cache-repository'
import { RedisService } from './redis/redis.service'
import { EnvModule } from '@/infra/env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
