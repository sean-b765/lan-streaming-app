import mongoose from 'mongoose'

const seasonSchema = new mongoose.Schema({
	path: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
		index: true,
	},
	series: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Series',
		required: true,
	},
	artwork: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},
	date: {
		type: String,
		required: false,
	},
})

export default mongoose.model('Season', seasonSchema)
