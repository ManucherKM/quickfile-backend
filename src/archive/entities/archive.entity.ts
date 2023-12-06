import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArchiveDocument = HydratedDocument<Archive>;

@Schema()
export class Archive {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  files: string[];
}

export const ArchiveSchema = SchemaFactory.createForClass(Archive);
