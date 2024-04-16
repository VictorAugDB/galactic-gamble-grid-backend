import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { BuyTicketUseCase } from '@/domain/usecases/buy-ticket'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user-decorator'

const buyTicketBodySchema = z.object({
  numbers: z
    .number()
    .array()
    .min(25)
    .max(25)
    .refine(
      (data) =>
        data.reduce((acc, curr) => (curr === 1 ? acc + 1 : acc), 0) >= 15,
      { message: 'Array must have at least 15 selected numbers' },
    )
    .refine(
      (data) =>
        data.reduce((acc, curr) => (curr === 1 ? acc + 1 : acc), 0) <= 20,
      { message: 'Array must have at most 20 selected numbers' },
    )
    .refine(
      (data) => {
        for (const element of data) {
          if (element !== 0 && element !== 1) {
            return false
          }
        }
        return true
      },
      { message: 'Array elements must be either 0 or 1' },
    ),
})

const bodyValidationPipe = new ZodValidationPipe(buyTicketBodySchema)

type BuyTicketBodySchema = z.infer<typeof buyTicketBodySchema>

@Controller('/tickets')
export class BuyTicketController {
  constructor(private buyTicket: BuyTicketUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: BuyTicketBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { numbers } = body
    const { sub: userId } = user

    await this.buyTicket.execute({ numbers, userId })
  }
}
