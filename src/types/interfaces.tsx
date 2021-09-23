import { MediaActions } from './enums'

interface BaseMedia {
	_id: string
	path: string
	name: string
	poster: string
	backdrop: string
	description: string
	vote_average: number
	date: string
	[key: string]: any
}

export interface IMedia extends BaseMedia {
	extension?: string
	size?: number
	thumbnail?: string
	displayName?: string
	episode?: number
	episodeName?: string
}

export interface ISeries extends BaseMedia {}

export interface IAction {
	type: MediaActions
	payload: any
}
