import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { BuyTicketUseCase } from '@/domain/usecases/buy-ticket'

const buyTicketBodySchema = z.object({
  userId: z.string(),
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

type BuyTicketBodySchema = z.infer<typeof buyTicketBodySchema>

@Controller('/buy-ticket')
export class BuyTicketController {
  constructor(private buyTicket: BuyTicketUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(buyTicketBodySchema))
  async handle(@Body() body: BuyTicketBodySchema) {
    const { numbers, userId } = body

    await this.buyTicket.execute({ numbers, userId })
  }
}
