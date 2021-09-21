export interface IMedia {
	_id: string
	path: string
	name: string
	extension: string
	size: number
	thumbnail: string
	displayName?: string
	episode?: number
	episodeName?: string
	[key: string]: any
}
