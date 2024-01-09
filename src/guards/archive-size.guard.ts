import { maxArchiveSize } from '@/archive/conts'
import { CreateArchiveDto } from '@/archive/dto/create-archive.dto'
import {
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common'

@Injectable()
export class ArchiveSizeGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest()

		const body = req.body as CreateArchiveDto

		let size = 0

		for (const file of body.files) {
			if (size + file.size > maxArchiveSize) {
				throw new HttpException(
					'The archive size is too large.',
					HttpStatus.PAYLOAD_TOO_LARGE,
				)
			}
		}

		return true
	}
}
