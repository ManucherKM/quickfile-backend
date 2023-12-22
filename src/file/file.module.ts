import { S3Module } from '@/s3/s3.module'
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { File, FileSchema } from './entities/file.entity'
import { FileService } from './file.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
		forwardRef(() => S3Module),
	],
	providers: [FileService],
	exports: [FileService],
})
export class FileModule {}
