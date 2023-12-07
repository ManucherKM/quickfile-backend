import { Module } from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { ArchiveController } from './archive.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Archive, ArchiveSchema } from './entities/archive.entity';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Archive.name, schema: ArchiveSchema }]),
    FileModule,
  ],
  controllers: [ArchiveController],
  providers: [ArchiveService],
})
export class ArchiveModule {}
