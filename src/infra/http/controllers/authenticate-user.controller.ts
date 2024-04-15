import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public-decorator'
import { AuthenticateUserUseCase } from '@/domain/usecases/authenticate-user'

const authenticateUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>

@Controller('/authenticate-user')
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(authenticateUserBodySchema))
  async handle(@Body() body: AuthenticateUserBodySchema) {
    const { email, password } = body

    const { accessToken } = await this.authenticateUser.execute({
      email,
      password,
    })

    return {
      accessToken,
    }
  }
}
