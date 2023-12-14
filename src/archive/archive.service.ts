import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Archive } from './entities/archive.entity';
import { Model } from 'mongoose';
import { FileService } from 'src/file/file.service';
import { CreateFileDto } from 'src/file/dto/create-file.dto';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import { getRandomStr } from 'src/utils';

@Injectable()
export class ArchiveService {
  constructor(
    @InjectModel(Archive.name)
    private readonly archiveModel: Model<Archive>,
    private readonly fileService: FileService,
  ) {}

  async uploadFiles(files: Express.Multer.File[]) {
    const id = await this.getId();

    const formatFiles: CreateFileDto[] = files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }));

    const createdFiles = await this.fileService.createMany(formatFiles);

    const fileIds = createdFiles.map((file) => file._id);

    await this.archiveModel.create({
      id,
      files: fileIds,
    });

    return { id };
  }

  async getId() {
    const id = getRandomStr(6);
    const isExist = await this.findById(id);

    if (isExist) {
      return await this.getId();
    }

    return id;
  }

  async findById(id: string) {
    return await this.archiveModel.findOne({ id });
  }

  async findOne(id: string) {
    const foundArchive = await this.findById(id);

    const fileIds = foundArchive.files;

    const files = await this.fileService.findMany(fileIds);

    const zip = new AdmZip();

    for (const file of files) {
      const filePath = path.join('uploads', file.filename);
      zip.addLocalFile(filePath, undefined, file.originalname);
    }

    const zipBuffer = zip.toBuffer();

    return zipBuffer;
  }
}
