import { Controller, Get, Query } from '@nestjs/common'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user-decorator'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { ListActiveTicketsUseCase } from '@/domain/usecases/list-active-tickets'
import { TicketsPresenter } from '../presenters/tickets-presenter'

const paginationQueryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  size: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(20).max(100)),
})

const queryValidationPipe = new ZodValidationPipe(paginationQueryParamsSchema)

type PaginationQueryParamsSchema = z.infer<typeof paginationQueryParamsSchema>

@Controller('/tickets')
export class ListActiveTicketsController {
  constructor(private listActiveTickets: ListActiveTicketsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) query: PaginationQueryParamsSchema,
  ) {
    const { sub: userId } = user
    const { size, page } = query

    const tickets = await this.listActiveTickets.execute({
      userId,
      pagination: {
        page,
        size,
      },
    })

    return { tickets: tickets.map((t) => TicketsPresenter.toHTTP(t)) }
  }
}
