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

app.get('/', (req, res) => {
	res.send(`<h1>Service running</h1>`)
})

const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

mongoose
	.connect(process.env.MONGO_URI)
	.then((res) => {
		console.log(`Connected to MongoDB!`)
	})
	.catch((err) => {
		console.log(`Failed to connect to MongoDB`)
	})
