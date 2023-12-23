import { diskStorage } from 'multer'
import { v4 } from 'uuid'

const normalizeFileName = (req, file, callback) => {
	file.originalname = decodeURIComponent(file.originalname)

	const fileExt = file.originalname.split('.').pop()
	const fileName = `${v4()}.${fileExt}`

	callback(null, fileName)
}

export const fileStorage = diskStorage({
	filename: normalizeFileName,
})
