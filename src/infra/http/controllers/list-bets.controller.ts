import { Controller, Get, Query } from '@nestjs/common'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user-decorator'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { ListBetsUseCase } from '@/domain/usecases/list-bets'
import { BetsPresenter } from '../presenters/bets-presenter'

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

@Controller('/bets')
export class ListBetsController {
  constructor(private listBets: ListBetsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) query: PaginationQueryParamsSchema,
  ) {
    const { sub: userId } = user
    const { size, page } = query

    const bets = await this.listBets.execute({
      userId,
      pagination: {
        page,
        size,
      },
    })

    return { bets: bets.map((t) => BetsPresenter.toHTTP(t)) }
  }
}
