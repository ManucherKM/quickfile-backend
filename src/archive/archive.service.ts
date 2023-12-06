import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Archive } from './entities/archive.entity';
import { Model } from 'mongoose';

@Injectable()
export class ArchiveService {
  constructor(
    @InjectModel(Archive.name)
    private readonly archiveModel: Model<Archive>,
  ) {}

  async uploadFiles(files: Express.Multer.File[]) {
    // const id = thi
    const asd = await this.archiveModel.create({
      id: this.getId(),
      files,
    });
    return 'This action adds a new archive';
  }

  async getId() {
    const id = Math.random().toString();
    const isExist = await this.findById(id);

    if (isExist) {
      return await this.getId();
    }

    return id;
  }

  async findById(id: string) {
    return await this.archiveModel.findOne({ id });
  }

  findOne(id: number) {
    return `This action returns a #${id} archive`;
  }
}
