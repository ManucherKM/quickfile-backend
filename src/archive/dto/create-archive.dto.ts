import { Type } from 'class-transformer'
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsString,
} from 'class-validator'

export class CreateArchiveDtoFile {
	@IsNotEmpty()
	@IsString()
	originalName: string

	@IsNotEmpty()
	@IsString()
	mimetype: string

	@IsNumber()
	size: number
}

export class CreateArchiveDto {
	@IsArray()
	@ArrayMinSize(1)
	@Type(() => CreateArchiveDtoFile)
	files: CreateArchiveDtoFile[]
}
