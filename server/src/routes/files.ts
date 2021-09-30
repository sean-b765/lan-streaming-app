import express, { Router } from 'express'
import {
	dropCollections,
	getMedia,
	getMediaFromSeason,
	getMediaFromSeries,
	getSeasons,
	getSeries,
	scanForFiles,
	streamMedia,
} from '../controllers/files'
const router: Router = express.Router()

router.get('/media', getMedia)
router.get('/series', getSeries)
router.get('/seasons/:series', getSeasons)

router.get('/series/:id', getMediaFromSeries)
router.get('/season/:id', getMediaFromSeason)

router.get('/stream/:id', streamMedia)

// TODO: protect admin routes
router.get('/scan', scanForFiles)
router.get('/drop', dropCollections)

export default router
