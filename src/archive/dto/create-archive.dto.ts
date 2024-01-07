export interface ICreateArchiveDtoFile {
	originalName: string
	mimetype: string
	size: number
}

export class CreateArchiveDto {
	files: ICreateArchiveDtoFile[]
}
