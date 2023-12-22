import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import * as env from 'env-var'
import { ArchiveModule } from './archive/archive.module'
import { S3Module } from './s3/s3.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		ScheduleModule.forRoot(),
		ArchiveModule,
		MongooseModule.forRoot(env.get('MONGODB_URL').required().asString()),
		S3Module,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
