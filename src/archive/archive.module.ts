import { Module } from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { ArchiveController } from './archive.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Archive, ArchiveSchema } from './entities/archive.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Archive.name, schema: ArchiveSchema }]),
  ],
  controllers: [ArchiveController],
  providers: [ArchiveService],
})
export class ArchiveModule {}
