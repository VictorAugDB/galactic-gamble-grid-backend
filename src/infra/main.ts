import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './http/pipes/all-exceptions.filter'
import { EnvService } from './env/env.service'

// CÓDIGO RESPONSÁVEL PRA RODAR EM SERVERLESS
// let server: Handler

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  const httpAdapter = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))

  app.init()

  // CÓDIGO RESPONSÁVEL PRA RODAR EM SERVERLESS
  // const expressApp = app.getHttpAdapter().getInstance()
  // return serverlessExpress({ app: expressApp })

  await app.listen(port)
}
bootstrap()

// CÓDIGO RESPONSÁVEL PRA RODAR EM SERVERLESS
// export const handler: Handler = async (
//   event: unknown,
//   context: Context,
//   callback: LexCallback,
// ) => {
//   server = server ?? (await bootstrap())
//   return server(event, context, callback)
// }
