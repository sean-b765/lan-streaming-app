import { _getFromSeries, _getMedia, _getSeries } from '../_services'

export const getMedia = async (filters: any = {}, sort: any = {}) => {
	try {
		const result = await _getMedia(filters, sort)

		return result
	} catch (err) {
		console.log(err)
	}
}

export const getSeries = async (filters: any = {}, sort: any = {}) => {
	try {
		return await _getSeries(filters, sort)
	} catch (err) {
		console.log(err)
	}
}

export const getAllFromSeries = async (id: string) => {
	try {
		return await _getFromSeries(id)
	} catch (err) {
		console.log(err)
	}
}
