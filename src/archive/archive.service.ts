import { CreateS3Dto } from '@/s3/dto/create-s3.dto'
import { S3Service } from '@/s3/s3.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import AdmZip from 'adm-zip'
import { Model } from 'mongoose'
import { CreateFileDto } from 'src/file/dto/create-file.dto'
import { FileService } from 'src/file/file.service'
import { getRandomStr } from 'src/utils'
import { v4 } from 'uuid'
import { Archive } from './entities/archive.entity'

@Injectable()
export class ArchiveService {
	constructor(
		@InjectModel(Archive.name)
		private readonly archiveModel: Model<Archive>,
		private readonly fileService: FileService,
		private readonly s3Service: S3Service,
	) {}

	async uploadFiles(files: Express.Multer.File[]) {
		const [models, s3] = this.getFormatedFiles(files)

		const createdModels = await this.fileService.createMany(models)

		await this.s3Service.createMany(s3)

		const fileIds = createdModels.map(file => file._id)

		const id = await this.getId()

		await this.archiveModel.create({
			id,
			files: fileIds,
		})

		return id
	}

	private getFormatedFiles(files: Express.Multer.File[]) {
		const s3: CreateS3Dto[] = []
		const models: CreateFileDto[] = []

		for (const file of files) {
			const fileName = this.getFileName()

			s3[s3.length] = {
				buffer: file.buffer,
				fileName,
			}

			models[models.length] = {
				fileName,
				mimetype: file.mimetype,
				originalName: file.originalname,
				size: file.size,
			}
		}

		return [models, s3] as [CreateFileDto[], CreateS3Dto[]]
	}

	getFileName() {
		return v4()
	}

	private async getId() {
		const id = getRandomStr(6)

		const isExist = await this.findById(id)

		if (isExist) {
			return await this.getId()
		}

		return id
	}

	async findById(id: string) {
		return await this.archiveModel.findOne({ id })
	}

	async getArchiveById(id: string) {
		const foundArchive = await this.findById(id)

		const fileIds = foundArchive.files

		const fileModels = await this.fileService.findMany(fileIds)

		const files = await this.s3Service.findManyByFileModels(fileModels)

		const zip = new AdmZip()

		for (let i = 0; i < fileModels.length; i++) {
			if (fileModels[i].isDeleted) {
				throw new Error('The archive files could not be found.')
			}

			zip.addFile(fileModels[i].originalName, files[i] as Buffer)
		}

		const zipBuffer = zip.toBuffer()

		return zipBuffer
	}

	async exist(id: string) {
		const foundArchive = await this.findById(id)
		return !!foundArchive
	}
}
