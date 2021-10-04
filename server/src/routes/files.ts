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

/**
 * Very simple password protected admin routes
 */
const passwordProtect = (req, res, next) => {
	if (req.params.adminpass !== process.env.ADMIN_PASS)
		return res.status(401).json({
			message: 'You do not have required permissions to access this route.',
		})

	next()
}

router.get('/scan/:adminpass', passwordProtect, scanForFiles)
router.get('/drop/:adminpass', passwordProtect, dropCollections)

export default router
