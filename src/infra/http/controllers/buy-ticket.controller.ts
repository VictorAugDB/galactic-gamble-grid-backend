import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const buyTicketBodySchema = z.object({})

type BuyTicketBodySchema = z.infer<typeof buyTicketBodySchema>

@Controller('/buy-ticket')
export class BuyTicketController {
  @Post()
  @UsePipes(new ZodValidationPipe(buyTicketBodySchema))
  async handle(@Body() body: BuyTicketBodySchema) {
    return 'Hello World'
  }
}
