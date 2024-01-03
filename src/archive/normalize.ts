import { v4 } from 'uuid'

export function NormalizeMiddleware(req, file, callback) {
	const normalizedOriginalName = Buffer.from(
		file.originalname,
		'latin1',
	).toString('utf-8')

	file.originalname = normalizedOriginalName

	file.filename = `${v4()}.${file.originalname.split('.').pop()}`

	callback(null, true)
}
