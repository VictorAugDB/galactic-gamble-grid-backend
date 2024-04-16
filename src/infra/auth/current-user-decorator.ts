import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export type UserPayload = {
  sub: string
}

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as UserPayload
  },
)
