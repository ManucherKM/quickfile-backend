import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { File, FileSchema } from './entities/file.entity'
import { FileService } from './file.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
	],
	providers: [FileService],
	exports: [FileService],
})
export class FileModule {}
