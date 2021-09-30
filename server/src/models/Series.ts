import mongoose from 'mongoose'

const seriesSchema = new mongoose.Schema({
	path: {
		type: String,
		required: true,
	},
	tmdb_id: {
		type: String,
		required: false,
	},
	name: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	poster: {
		type: String,
		required: false,
	},
	backdrop: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},
	vote_average: {
		type: Number,
		required: false,
	},
	date: {
		type: String,
		required: false,
	},
})

export default mongoose.model('Series', seriesSchema)
