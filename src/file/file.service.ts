import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Cron } from '@nestjs/schedule'
import fs from 'fs'
import { Model, Types } from 'mongoose'
import path from 'path'
import { CreateFileDto } from './dto/create-file.dto'
import { File } from './entities/file.entity'

@Injectable()
export class FileService {
	private readonly logger = new Logger(FileService.name)

	constructor(
		@InjectModel(File.name)
		private readonly fileModel: Model<File>,
	) {}

	async create(createFileDto: CreateFileDto) {
		return await this.fileModel.create(createFileDto)
	}

	async findOne(id: string) {
		return await this.fileModel.findById(id)
	}

	async createMany(files: CreateFileDto[]) {
		return await this.fileModel.insertMany(files)
	}

	async findMany(ids: (string | Types.ObjectId)[]) {
		return await this.fileModel.find({ _id: ids })
	}

	async removeOld() {
		const dateNow = new Date()

		const date7DaysAgo = new Date()
		date7DaysAgo.setDate(dateNow.getDate() - 7)

		const date9DaysAgo = new Date()
		date9DaysAgo.setDate(dateNow.getDate() - 9)

		const files = await this.fileModel.find({
			createdAt: {
				$lt: date7DaysAgo,
				$gt: date9DaysAgo,
			},
		})

		for (const file of files) {
			const pathToFile = path.join('uploads', file.filename)
			fs.unlink(pathToFile, err => {
				if (err) throw err
				file.isDeleted = true
				file.save()
			})
		}
	}

	// @Cron(CronExpression.EVERY_DAY_AT_4AM)
	@Cron('10 * * * * *')
	async handleCron() {
		try {
			this.logger.debug('Called when the current second is 10')
			await this.removeOld()
		} catch (e) {
			console.log(e)
		}
	}
}
