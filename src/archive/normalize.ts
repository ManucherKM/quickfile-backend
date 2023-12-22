import { diskStorage } from 'multer'
import { v4 } from 'uuid'

const normalizeFileName = (req, file, callback) => {
	file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')

	const fileExt = file.originalname.split('.').pop()
	const fileName = `${v4()}.${fileExt}`

	callback(null, fileName)
}

export const fileStorage = diskStorage({
	filename: normalizeFileName,
})
