import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UserAlreadyExistsError } from '@/domain/usecases/errors/user-already-exists'
import { WrongCredentialsError } from '@/domain/usecases/errors/wrong-credentials-error'
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const responseBody = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: '',
      errors:
        exception instanceof BadRequestException
          ? exception.getResponse()
          : null,
    }

    console.log(exception)

    if (exception instanceof WrongCredentialsError) {
      httpStatus = HttpStatus.UNAUTHORIZED
      responseBody.message = exception.message
    } else if (exception instanceof NotAllowedError) {
      httpStatus = HttpStatus.METHOD_NOT_ALLOWED
      responseBody.message = exception.message
    } else if (exception instanceof UserAlreadyExistsError) {
      httpStatus = HttpStatus.CONFLICT
      responseBody.message = exception.message
    } else if (
      exception instanceof Error &&
      !(exception instanceof HttpException)
    ) {
      httpStatus = HttpStatus.BAD_REQUEST
      responseBody.message = exception.message
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
