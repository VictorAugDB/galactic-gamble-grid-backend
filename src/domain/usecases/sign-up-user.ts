import { HashGenerator } from '../cryptography/hash-generator'
import { User } from '../entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

type SignUpUserUseCaseRequest = {
  name: string
  email: string
  password: string
}

export class SignUpUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: SignUpUserUseCaseRequest): Promise<void> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError(email)
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    await this.usersRepository.create(
      User.create({
        email,
        name,
        password: hashedPassword,
      }),
    )
  }
}
