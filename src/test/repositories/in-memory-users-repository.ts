import { User } from '@/domain/entities/user'
import { UsersRepository } from '@/domain/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(
      this.items.find((item) => item.email === email) ?? null,
    )
  }

  create(user: User): Promise<void> {
    this.items.push(user)

    return Promise.resolve()
  }
}
