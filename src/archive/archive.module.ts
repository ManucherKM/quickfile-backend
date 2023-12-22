import { S3Module } from '@/s3/s3.module'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FileModule } from 'src/file/file.module'
import { ArchiveController } from './archive.controller'
import { ArchiveService } from './archive.service'
import { Archive, ArchiveSchema } from './entities/archive.entity'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Archive.name, schema: ArchiveSchema }]),
		FileModule,
		S3Module,
	],
	controllers: [ArchiveController],
	providers: [ArchiveService],
})
export class ArchiveModule {}
