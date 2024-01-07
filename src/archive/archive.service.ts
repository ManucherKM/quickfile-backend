import { CreateFileDto } from '@/file/dto/create-file.dto'
import { S3Service } from '@/s3/s3.service'
import { getRandomStr } from '@/utils'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import AdmZip from 'adm-zip'
import { Model } from 'mongoose'
import { FileService } from 'src/file/file.service'
import { v4 } from 'uuid'
import { CreateArchiveDto } from './dto/create-archive.dto'
import { Archive } from './entities/archive.entity'

@Injectable()
export class ArchiveService {
	constructor(
		@InjectModel(Archive.name)
		private readonly archiveModel: Model<Archive>,
		private readonly fileService: FileService,
		private readonly s3Service: S3Service,
	) {}

	async uploadFiles(createArchiveDto: CreateArchiveDto) {
		const formatedFiles = this.getFormatedFiles(createArchiveDto)

		const files = await this.fileService.createMany(formatedFiles)

		const fileIds = files.map(file => file._id)

		const fileNames = formatedFiles.map(file => file.fileName)

		const urls = await this.s3Service.getManyPresignedUrls(fileNames)

		const id = await this.getId()

		await this.archiveModel.create({
			id,
			files: fileIds,
		})

		return {
			id,
			urls,
		}
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

	getFormatedFiles(createArchiveDto: CreateArchiveDto): CreateFileDto[] {
		return createArchiveDto.files.reduce((res, val) => {
			const ext = val.originalName.split('.').pop()
			res[res.length] = { ...val, fileName: v4() + '.' + ext }
			return res
		}, [])
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
