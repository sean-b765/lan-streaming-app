import fs from 'fs'
import { IMedia } from '../types/interfaces'

const validExtensions = ['mp4', 'webm', 'mkv', 'avi', 'mpeg', 'mov']

/**
 * Get file stats (size, last modified, created, etc)
 */
export const fileStats = (path: string): fs.Stats => fs.statSync(path)

const isFile = (stats: fs.Stats, extension: string): boolean =>
	stats.size !== 0 && validExtensions.includes(extension)

const getExtension = (file: string): string =>
	file.split('.')[file.split('.').length - 1]

/**
 * Get array of files or folders.
 */
export const getFilesFromPath = (path: string): IMedia[] =>
	fs
		.readdirSync(path)
		.map((file, index): IMedia => {
			const extension = getExtension(file)
			const { size } = fileStats(`${path}/${file}`)

			let _file = file.replace(/\./g, ' ')

			if (validExtensions.includes(extension)) {
				const name = _file.replace(`.${extension}`, '')

				return {
					name,
					path: `${path}/${file}`,
					isFile: isFile(fileStats(`${path}/${file}`), extension),
					isFolder: size === 0,
					size: size,
					extension,
				}
			} else {
				return {
					name: _file,
					path: `${path}/${file}`,
					isFile: isFile(fileStats(`${path}/${file}`), extension),
					isFolder: size === 0,
					size: size,
				}
			}
		})
		.filter((file) => file.isFile || file.isFolder)
