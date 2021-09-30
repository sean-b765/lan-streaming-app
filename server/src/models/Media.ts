import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema({
	path: {
		type: String,
		required: true,
		unique: true,
	},
	duration: {
		type: Number,
		required: false,
	},
	extension: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
		index: true,
	},
	displayName: {
		type: String,
		required: false,
	},
	size: {
		type: Number,
		default: 0,
		required: false,
	},
	episode: {
		type: Number,
		required: false,
	},
	episodeName: {
		type: String,
		required: false,
	},
	series: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Series',
		required: false,
	},
	season: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Season',
		required: false,
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

export default mongoose.model('Media', mediaSchema)
