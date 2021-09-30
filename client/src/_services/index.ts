import { api_url } from '../util/constants'

export const _getMedia = async (filter: any = {}, sort: any = {}) =>
	await fetch(`${api_url}/files/media`).then((res) => res.json())

export const _getSeries = async (filter: any = {}, sort: any = {}) =>
	await fetch(`${api_url}/files/series`).then((res) => res.json())

export const _getFromSeries = async (id: string) =>
	await fetch(`${api_url}/files/series/${id}`).then((res) => res.json())

export const _getFromSeason = async (id: string) =>
	await fetch(`${api_url}/files/season/${id}`).then((res) => res.json())
