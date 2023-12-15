import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import * as env from 'env-var'
import { ArchiveModule } from './archive/archive.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		ArchiveModule,
		MongooseModule.forRoot(env.get('MONGODB_URL').required().asString()),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
