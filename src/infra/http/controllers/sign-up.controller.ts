import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { SignUpUserUseCase } from '@/domain/usecases/sign-up-user'
import { Public } from '@/infra/auth/public-decorator'

const signUpBodySchema = z.object({
  name: z.string().max(80),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((value) => /[0-9]/.test(value), {
      message: 'Password must contain at least one number',
    })
    .refine((value) => /[^a-zA-Z0-9]/.test(value), {
      message: 'Password must contain at least one special character',
    }),
})

type SignUpBodySchema = z.infer<typeof signUpBodySchema>

@Controller('/sign-up')
export class SignUpController {
  constructor(private signUpUser: SignUpUserUseCase) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(signUpBodySchema))
  async handle(@Body() body: SignUpBodySchema) {
    const { email, name, password } = body

    const { accessToken } = await this.signUpUser.execute({
      email,
      name,
      password,
    })

    return {
      accessToken,
    }
  }
}
