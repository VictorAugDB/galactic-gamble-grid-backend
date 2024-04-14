import { SignUpUserUseCase } from './sign-up-user'
import { faker } from '@faker-js/faker'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeUser } from '@/test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: SignUpUserUseCase

describe('Sign Up User', () => {
  beforeEach(() => {
    const fakeHasher = new FakeHasher()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new SignUpUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to create user', async () => {
    const data = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    }

    await sut.execute({
      ...data,
      password: faker.internet.password(),
    })

    expect(inMemoryUsersRepository.items[0]).toEqual(
      expect.objectContaining(data),
    )
  })

  it('should throw if user already exists', async () => {
    const email = faker.internet.email()
    await inMemoryUsersRepository.create(makeUser({ email }))

    expect(
      sut.execute({
        name: faker.person.fullName(),
        email,
        password: faker.internet.password(),
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to hash the password before registration', async () => {
    const password = faker.internet.password()

    await sut.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password,
    })

    expect(inMemoryUsersRepository.items[0]).toEqual(
      expect.objectContaining({
        password: `${password}-hashed`,
      }),
    )
  })
})
