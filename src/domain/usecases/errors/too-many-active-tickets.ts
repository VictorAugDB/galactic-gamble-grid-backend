import { MAX_NUMBER_OF_ACTIVE_TICKETS } from '@/core/config/max-number-of-active-tickets'
import { UseCaseError } from '@/core/errors/use-case-error'

export class TooManyActiveTicketsErrorError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`You exceeded the amount of ${MAX_NUMBER_OF_ACTIVE_TICKETS} tickets.`)
  }
}
