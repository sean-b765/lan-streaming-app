export interface IMedia {
	name: string
	path: string
	isFile: boolean
	isFolder: boolean
	size: number
	extension?: string
	series?: string
	season?: string
	year?: number
	[key: string]: any
}

export interface IStandaloneMovie extends IMedia {}

export interface ISeries extends IMedia {
	children?: ISeason[]
	tmdb_id?: number
}

export interface IMovieSeries extends IMedia {
	children?: IMedia[]
}

export interface ISeason extends IMedia {
	children?: IMedia[]
}

export interface IExtendedParser extends ParseTorrentTitle.DefaultParserResult {
	episodeName?: string
	[key: string]: any
}
