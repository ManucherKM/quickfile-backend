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
import { ArchiveService } from './archive.service'
import { fileStorage } from './storage'

@Controller('archive')
export class ArchiveController {
	constructor(private readonly archiveService: ArchiveService) {}

	@Post()
	@UseInterceptors(
		FilesInterceptor('files', undefined, {
			storage: fileStorage,
		}),
	)
	uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
		return this.archiveService.uploadFiles(files)
	}
	@Get(':id')
	async findOne(@Param('id') id: string) {
		try {
			const zipBuffer = await this.archiveService.findOne(id)
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
