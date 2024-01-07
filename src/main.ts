import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as env from 'env-var'
import { AppModule } from './app.module'

const PORT = env.get('PORT').asString() || 5000
const CLIENT_URL = env.get('CLIENT_URL').required().asString()

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.useGlobalPipes(new ValidationPipe())

	app.enableCors({ origin: CLIENT_URL })

	app.setGlobalPrefix('api')

	await app.listen(PORT)
}

bootstrap()
