import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFiles,
  StreamableFile,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';

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
    return this.archiveService.uploadFiles(files);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const zipBuffer = await this.archiveService.findOne(id);
      return new StreamableFile(zipBuffer);
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST);
    }
  }
}
