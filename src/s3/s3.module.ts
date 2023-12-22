import { FileModule } from '@/file/file.module'
import { Module, forwardRef } from '@nestjs/common'
import { S3Service } from './s3.service'

@Module({
	providers: [S3Service],
	exports: [S3Service],
	imports: [forwardRef(() => FileModule)],
})
export class S3Module {}
