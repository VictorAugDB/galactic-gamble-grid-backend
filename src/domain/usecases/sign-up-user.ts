import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { User } from '../entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'
import { Encrypter } from '../cryptography/encrypter'

type SignUpUserUseCaseRequest = {
  name: string
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = {
  accessToken: string
}

@Injectable()
export class SignUpUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    name,
    password,
  }: SignUpUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError(email)
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    const user = User.create({
      email,
      name,
      password: hashedPassword,
    })

    await this.usersRepository.create(user)

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    return {
      accessToken,
    }
  }
}
