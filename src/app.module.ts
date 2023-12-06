import { Module } from '@nestjs/common';
import { ArchiveModule } from './archive/archive.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as env from 'env-var';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ArchiveModule,
    MongooseModule.forRoot(env.get('MONGODB_URL').required().asString()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
