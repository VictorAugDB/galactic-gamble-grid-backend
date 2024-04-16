import { UsersRepository } from '@/domain/repositories/users-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { User } from '@/domain/entities/user'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async create(user: User): Promise<void> {
    const { id: _id, ...data } = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })
  }
}
