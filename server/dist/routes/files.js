"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const files_1 = require("../controllers/files");
const router = express_1.default.Router();
router.get('/media', files_1.getMedia);
router.get('/series', files_1.getSeries);
router.get('/seasons/:series', files_1.getSeasons);
router.get('/series/:id', files_1.getMediaFromSeries);
router.get('/season/:id', files_1.getMediaFromSeason);
router.get('/stream/:id', files_1.streamMedia);
/**
 * Very simple password protected admin routes
 */
const passwordProtect = (req, res, next) => {
    if (req.params.adminpass !== process.env.ADMIN_PASS)
        return res.status(401).json({
            message: 'You do not have required permissions to access this route.',
        });
    next();
};
// TODO: protect admin routes
router.get('/scan/:adminpass', passwordProtect, files_1.scanForFiles);
router.get('/drop/:adminpass', passwordProtect, files_1.dropCollections);
exports.default = router;
