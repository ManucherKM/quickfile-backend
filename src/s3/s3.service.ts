import { FileDocument } from '@/file/entities/file.entity'
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import * as env from 'env-var'
import { CreateS3Dto } from './dto/create-s3.dto'

@Injectable()
export class S3Service {
	private readonly s3Client = new S3Client({
		region: env.get('YANDEX_STORAGE_REGION').required().asString(),
		endpoint: env.get('YANDEX_STORAGE_ENDPOINT').required().asString(),
		credentials: {
			accessKeyId: env.get('YANDEX_STORAGE_ID').required().asString(),
			secretAccessKey: env.get('YANDEX_STORAGE_KEY').required().asString(),
		},
	})

	private readonly s3Bucket = 'quickfile'
	private readonly s3Folder = 'files'

	async create(createS3Dto: CreateS3Dto) {
		const command = new PutObjectCommand({
			Bucket: this.s3Bucket,
			Key: this.getS3Path(createS3Dto.fileName),
			Body: createS3Dto.buffer,
		})

		return await this.s3Client.send(command)
	}

	private getS3Path(fileName: string) {
		return this.s3Folder + '/' + fileName
	}

	async createMany(files: CreateS3Dto[]) {
		const promises = []

		for (const file of files) {
			promises.push(this.create(file))
		}

		return await Promise.all(promises)
	}

	async findOne(fileName: string) {
		const { Body } = await this.s3Client.send(
			new GetObjectCommand({
				Bucket: this.s3Bucket,
				Key: this.getS3Path(fileName),
			}),
		)

		return Body.transformToByteArray()
	}

	async findManyByFileModels(fileModels: FileDocument[]) {
		const promises: Promise<Uint8Array>[] = []

		for (const fileModel of fileModels) {
			promises.push(this.findOne(fileModel.fileName))
		}

		return await Promise.all(promises)
	}

	async remove(fileName: string) {
		const command = new DeleteObjectCommand({
			Bucket: this.s3Bucket,
			Key: this.getS3Path(fileName),
		})

		return await this.s3Client.send(command)
	}
}
