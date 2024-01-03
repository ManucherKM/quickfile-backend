import { S3Module } from '@/s3/s3.module'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { FileModule } from 'src/file/file.module'
import { ArchiveController } from './archive.controller'
import { ArchiveService } from './archive.service'
import { Archive, ArchiveSchema } from './entities/archive.entity'

@Module({
	imports: [
		ThrottlerModule.forRoot([
			{
				ttl: 10000,
				limit: 3,
			},
		]),
		MongooseModule.forFeature([{ name: Archive.name, schema: ArchiveSchema }]),
		FileModule,
		S3Module,
	],
	controllers: [ArchiveController],
	providers: [
		ArchiveService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class ArchiveModule {}
