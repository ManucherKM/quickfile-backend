import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFiles,
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
  findOne(@Param('id') id: string) {
    return this.archiveService.findOne(+id);
  }
}
