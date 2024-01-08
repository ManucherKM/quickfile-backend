import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	StreamableFile,
} from '@nestjs/common'
import { ArchiveService } from './archive.service'
import { CreateArchiveDto } from './dto/create-archive.dto'

@Controller('archive')
export class ArchiveController {
	constructor(private readonly archiveService: ArchiveService) {}

	@Post()
	async uploadFiles(@Body() createArchiveDto: CreateArchiveDto) {
		try {
			return await this.archiveService.uploadFiles(createArchiveDto)
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
			return await this.archiveService.exist(id)
		} catch (e) {
			throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST)
		}
	}
}
