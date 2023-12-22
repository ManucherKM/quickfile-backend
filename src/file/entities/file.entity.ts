import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type FileDocument = HydratedDocument<File>

@Schema({
	timestamps: true,
})
export class File {
	@Prop({ required: true, type: String, unique: true })
	fileName: string

	@Prop({ required: true, type: String })
	originalName: string

	@Prop({ required: true, type: String })
	mimetype: string

	@Prop({ required: true, type: Number })
	size: number

	@Prop({ default: false, type: Boolean })
	isDeleted: boolean
}

export const FileSchema = SchemaFactory.createForClass(File)
