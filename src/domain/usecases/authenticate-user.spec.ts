import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { FakeHasher } from '@/test/repositories/cryptography/fake-hasher'
import { AuthenticateUserUseCase } from './authenticate-user'
import { FakeEncrypter } from '@/test/repositories/cryptography/fake-encrypter'
import { faker } from '@faker-js/faker'
import { makeUser } from '@/test/repositories/factories/make-user'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate user', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    const user = makeUser({ password: await fakeHasher.hash(password), email })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({ email, password })

    expect(result).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should be able to throw if user does not exists', async () => {
    const password = faker.internet.password()
    const user = makeUser({
      password: await fakeHasher.hash(password),
      email: faker.internet.email(),
    })

    await inMemoryUsersRepository.create(user)

    expect(sut.execute({ email: '123', password })).rejects.toBeInstanceOf(
      WrongCredentialsError,
    )
  })

  it('should be able to throw if the user password do not match', async () => {
    const email = faker.internet.email()
    const user = makeUser({
      password: await fakeHasher.hash(faker.internet.password()),
      email,
    })

    await inMemoryUsersRepository.create(user)

    expect(sut.execute({ email, password: '123' })).rejects.toBeInstanceOf(
      WrongCredentialsError,
    )
  })
})
