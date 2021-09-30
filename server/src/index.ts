import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import files from './routes/files'
import mongoose from 'mongoose'

dotenv.config()

const app = express()

app.use(
	cors({
		origin: '*',
	})
)
app.use(express.json({ limit: '10mb' }))

app.use('/files', files)

app.listen(5000, () => {
	console.log(`Server running on port ${5000}`)
})

mongoose
	.connect(process.env.MONGO_URI)
	.then((res) => {
		console.log(`Connected to MongoDB!`)
	})
	.catch((err) => {
		console.log(`Failed to connect to MongoDB`)
	})
