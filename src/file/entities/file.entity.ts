import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {
  @Prop({ required: true, type: String, unique: true })
  filename: string;

  @Prop({ required: true, type: String })
  originalname: string;

  @Prop({ required: true, type: String })
  mimetype: string;

  @Prop({ required: true, type: Number })
  size: number;
}

export const FileSchema = SchemaFactory.createForClass(File);
