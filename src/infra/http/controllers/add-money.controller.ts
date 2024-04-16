import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AddMoneyUseCase } from '@/domain/usecases/add-money'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user-decorator'

const addMoneyBodySchema = z.object({
  value: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(addMoneyBodySchema)

type AddMoneyBodySchema = z.infer<typeof addMoneyBodySchema>

@Controller('/add-money')
export class AddMoneyController {
  constructor(private addMoney: AddMoneyUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AddMoneyBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { value } = body
    const { sub: userId } = user

    await this.addMoney.execute({ userId, value })
  }
}
