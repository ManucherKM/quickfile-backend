import { FileDocument } from '@/file/entities/file.entity'
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	PutObjectCommandInput,
	S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import * as env from 'env-var'
import { Readable } from 'stream'
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
		const Body = this.getReadableStream(createS3Dto.buffer)

		const upload = new Upload({
			client: this.s3Client,
			params: {
				Bucket: this.s3Bucket,
				Key: this.getS3Path(createS3Dto.fileName),
				Body,
			},
		})

		const res = await upload.done()

		return res
	}

	private getS3Path(fileName: string) {
		return this.s3Folder + '/' + fileName
	}

	private getReadableStream(buffer: Buffer) {
		const readable = new Readable()
		readable._read = () => {}
		readable.push(buffer)
		readable.push(null)
		return readable
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

	async getPresignedUrl(fileName: string) {
		const options: PutObjectCommandInput = {
			Bucket: this.s3Bucket,
			Key: this.getS3Path(fileName),
		}

		const command = new PutObjectCommand(options)

		const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 })

		return url
	}

	async getManyPresignedUrls(fileNames: string[]) {
		const promises: Promise<string>[] = []

		for (const fileName of fileNames) {
			promises[promises.length] = this.getPresignedUrl(fileName)
		}

		return await Promise.all(promises)
	}
}
