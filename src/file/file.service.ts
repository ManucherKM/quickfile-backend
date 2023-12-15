import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreateFileDto } from './dto/create-file.dto'
import { File } from './entities/file.entity'

@Injectable()
export class FileService {
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
}
