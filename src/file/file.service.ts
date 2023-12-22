import { S3Service } from '@/s3/s3.service'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Model, Types } from 'mongoose'
import { CreateFileDto } from './dto/create-file.dto'
import { File } from './entities/file.entity'

@Injectable()
export class FileService {
	private readonly logger = new Logger(FileService.name)

	constructor(
		@InjectModel(File.name)
		private readonly fileModel: Model<File>,
		private readonly s3Service: S3Service,
	) {}

	async create(createFileDto: CreateFileDto) {
		return await this.fileModel.create(createFileDto)
	}

	async createMany(files: CreateFileDto[]) {
		return await this.fileModel.insertMany(files)
	}

	async findMany(ids: (string | Types.ObjectId)[]) {
		return await this.fileModel.find({ _id: ids })
	}

	private getDatesForRemoveFiles() {
		const dateNow = new Date()

		const date7DaysAgo = new Date()
		date7DaysAgo.setDate(dateNow.getDate() - 7)

		const date9DaysAgo = new Date()
		date9DaysAgo.setDate(dateNow.getDate() - 9)

		return {
			date7DaysAgo,
			date9DaysAgo,
		}
	}

	async removeOld() {
		const { date7DaysAgo, date9DaysAgo } = this.getDatesForRemoveFiles()

		const files = await this.fileModel.find({
			createdAt: {
				$lt: date7DaysAgo,
				$gt: date9DaysAgo,
			},
		})

		const promises = []

		for (const file of files) {
			if (file.isDeleted) continue

			promises.push(this.s3Service.remove(file.fileName))

			file.isDeleted = true
			file.save()
		}

		await Promise.all(promises)
	}

	@Cron(CronExpression.EVERY_DAY_AT_4AM)
	// @Cron('10 * * * * *')
	async handleCron() {
		try {
			// this.logger.debug('Called when the current second is 10')
			await this.removeOld()
		} catch (e) {
			console.log(e)
		}
	}
}
