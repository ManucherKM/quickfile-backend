import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type ArchiveDocument = HydratedDocument<Archive>

@Schema()
export class Archive {
	@Prop({ required: true, type: String })
	id: string

	@Prop({ required: true, type: Types.ObjectId, ref: 'File' })
	files: Types.ObjectId[]
}

export const ArchiveSchema = SchemaFactory.createForClass(Archive)
