import {
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	StreamableFile,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { ArchiveService } from './archive.service'
import { NormalizeMiddleware } from './normalize'

@Controller('archive')
export class ArchiveController {
	constructor(private readonly archiveService: ArchiveService) {}

	@Post()
	@UseInterceptors(
		FilesInterceptor('files', undefined, {
			storage: memoryStorage(),
			limits: {
				fileSize: 5e8, // 500 MB
			},
			fileFilter: NormalizeMiddleware,
		}),
	)
	async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
		try {
			const id = await this.archiveService.uploadFiles(files)
			return { id }
		} catch (e) {
			throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST)
		}
	}

	@Get(':id')
	async getArchiveById(@Param('id') id: string) {
		try {
			const zipBuffer = await this.archiveService.getArchiveById(id)
			return new StreamableFile(zipBuffer)
		} catch (e) {
			throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST)
		}
	}

	@Get('exist/:id')
	async exist(@Param('id') id: string) {
		try {
			const exist = await this.archiveService.exist(id)
			return { exist }
		} catch (e) {
			throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST)
		}
	}
}
