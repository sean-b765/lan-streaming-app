"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamMedia = exports.getMediaFromSeason = exports.getMediaFromSeries = exports.getSeasons = exports.getSeries = exports.getMedia = exports.dropCollections = exports.scanForFiles = void 0;
const util_files_1 = require("../util/util-files");
const parse_torrent_title_1 = __importDefault(require("parse-torrent-title"));
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const axios_1 = __importDefault(require("axios"));
const Series_1 = __importDefault(require("../models/Series"));
const Season_1 = __importDefault(require("../models/Season"));
const Media_1 = __importDefault(require("../models/Media"));
// Add regex named group for 'Episode 04' or 'Episode IV'
parse_torrent_title_1.default.addHandler('episodeName', /(([eE]pisode\s?\.?\-?)[A-Z0-9]{1,})/);
// Add regex for full name until ( or - . useful for correctly formatted media names
parse_torrent_title_1.default.addHandler('fullName', /([^(-]+)/);
var SearchTypes;
(function (SearchTypes) {
    SearchTypes["MOVIE"] = "movie";
    SearchTypes["TV"] = "tv";
    SearchTypes["MULTI"] = "multi";
})(SearchTypes || (SearchTypes = {}));
const urlToBase64 = async (url) => {
    const result = await axios_1.default.get(`${process.env.IMAGE_URL}/${url}`, {
        responseType: 'arraybuffer',
    });
    return `data:image/jpeg;base64,${Buffer.from(result.data, 'binary').toString('base64')}`;
};
const getMetadata = async (path) => {
    return new Promise((resolve, reject) => {
        fluent_ffmpeg_1.default.ffprobe(path, (error, data) => {
            if (error)
                return reject(0);
            const rounded = parseInt(Number(data.format.duration / 60).toFixed(0));
            return resolve(rounded);
        });
    });
};
const getMediaDetails = async (query, searchType = SearchTypes.MULTI, year = 0) => {
    if (!query)
        return {
            poster: null,
            backdrop: null,
            description: null,
            vote_average: null,
            date: null,
            tmdb_id: null,
        };
    try {
        const yearFilter = year !== 0 ? (searchType !== SearchTypes.TV ? `&year=${year}` : '') : '';
        const result = await axios_1.default.get(`${process.env.TMDB_API_URL}/search/${searchType}?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${query}&page=1${yearFilter}`);
        const poster = await urlToBase64(result.data.results[0].poster_path);
        const backdrop = await urlToBase64(result.data.results[0].backdrop_path);
        const vote_average = result.data.results[0].vote_average;
        const id = result.data.results[0].id;
        // formated as YYYY-MM-DD
        const date = result.data.results[0]?.first_air_date ||
            result.data.results[0]?.release_date;
        const description = result.data.results[0]?.overview || '';
        return {
            poster: poster,
            backdrop: backdrop,
            date,
            vote_average,
            description,
            tmdb_id: id,
        };
    }
    catch (err) {
        return {
            poster: null,
            backdrop: null,
            description: null,
            vote_average: null,
            date: null,
            tmdb_id: null,
        };
    }
};
const getSeasonDetails = async (tmdb_id, season) => {
    const result = await axios_1.default.get(`${process.env.TMDB_API_URL}/tv/${tmdb_id}/season/${season}?api_key=${process.env.TMDB_API_KEY}`);
    const artwork = await urlToBase64(result.data.poster_path);
    return {
        artwork,
        description: result.data.overview,
        date: result.data.air_date,
    };
};
const getEpisodeDetails = async (tmdb_id, season, episode) => {
    const result = await axios_1.default.get(`${process.env.TMDB_API_URL}/tv/${tmdb_id}/season/${season}/episode/${episode}?api_key=${process.env.TMDB_API_KEY}`);
    const poster = result.data.still_path && (await urlToBase64(result.data.still_path));
    return {
        poster,
        description: result.data.overview,
        vote_average: result.data.vote_average || 0,
        date: result.data.air_date,
        episodeName: result.data.name,
    };
};
/*
 * Gets all files and folders, while also retrieving a screenshot to be used as a thumbnail
 */
const recursiveFileScan = (item) => {
    const path = `${item.path}`;
    const fileName = path.split('/')[path.split('/').length - 1];
    // remove the common directory from absolute path
    let tmp = path.replace(process.env.DIR, '');
    // Remove the file name
    tmp = tmp.replace(fileName, '');
    // Get the first folder, as this will be the series (if is contained in a folder)
    let series = tmp.split('/')[1];
    let season = tmp.split('/')[2];
    // use parse-torrent-title package to get information
    let name = item.name;
    const info = parse_torrent_title_1.default.parse(name);
    if (item.isFolder) {
        // Go further
        let files = (0, util_files_1.getFilesFromPath)(item.path);
        files = files.map((f) => recursiveFileScan(f));
        if (series && season) {
            return {
                ...item,
                series,
                season,
                children: files,
            };
        }
        else if (series) {
            return {
                ...item,
                series,
                children: files,
            };
        }
        else {
            return {
                ...item,
                children: files,
            };
        }
    }
    if (item.isFile) {
        if (series && season) {
            return {
                ...item,
                series,
                season,
                episode: info.episode || null,
                episodeName: info.episodeName || null,
            };
        }
        else if (series) {
            return {
                ...item,
                series,
                episode: info.episode || null,
                episodeName: info.episodeName || null,
                fullName: info.fullName || null,
                displayName: info.title || null,
                year: info.year,
            };
        }
        else {
            return {
                ...item,
                displayName: info.title || null,
                episode: info.episode || null,
                episodeName: info.episodeName || null,
                year: info.year,
            };
        }
    }
};
/*
 * Admin route - scan for files within directory
 */
const scanForFiles = async (req, res) => {
    let files = (0, util_files_1.getFilesFromPath)(process.env.DIR);
    files = files.map((f) => recursiveFileScan(f));
    // Now we have a multi-dimensional array of files/folders...
    // we can read through them all and create documents in the DB
    try {
        files.forEach(async (item) => {
            if (item.isFolder) {
                /*
                    SERIES
                */
                await createSeriesDoc(item);
                item.children.forEach(async (media) => {
                    // Find series by name
                    const series = await Series_1.default.findOne({ name: media.series });
                    // Get if season exists via series id and media season name ('Season 1')
                    //  create the season if not existing
                    const seasonExists = await Season_1.default.exists({
                        $and: [
                            { name: { $eq: media.season } },
                            { series: { $eq: series._id } },
                        ],
                    });
                    if (media.isFolder) {
                        /*
                            SEASONS
                        */
                        // Create the season if it does not exist!
                        if (!seasonExists) {
                            // console.log(`Season: ${media.name}`, `${media.series}`)
                            await createSeasonDoc(media, series);
                        }
                        media.children.forEach(async (episode) => {
                            /*
                                EPISODES
                            */
                            await createEpisodeDoc(episode);
                        });
                    }
                    if (media.isFile) {
                        /*
                            MOVIE SERIES
                                (or if there is only one season of a tv show,
                                    however this should not be the case if media folder is
                                    correctly structured)
                        */
                        await createMovieSeriesDoc(media, series._id);
                    }
                });
            }
            if (item.isFile) {
                /*
                    STANDALONE MOVIES
                */
                await createStandaloneMovieDoc(item);
            }
        });
        console.log('Completed DB initialization');
    }
    catch (err) {
        console.log(err);
    }
    res.status(200).json(files);
};
exports.scanForFiles = scanForFiles;
const createSeasonDoc = async (media, series) => {
    try {
        if (!series._id)
            return;
        // Season 1  =>  1
        const season = media.name.split(' ')[media.name.split(' ').length - 1];
        // get artwork
        const result = await getSeasonDetails(series.tmdb_id, season);
        await Season_1.default.create({
            name: media.name,
            path: media.path,
            series: series._id,
            ...result,
        });
    }
    catch (err) {
        console.log(err);
    }
};
const createSeriesDoc = async (item) => {
    const result = await Series_1.default.exists({ name: item.name });
    if (!result) {
        const result = await getMediaDetails(item.name, SearchTypes.MULTI, item.year);
        return await Series_1.default.create({
            name: item.name,
            path: item.path,
            ...result,
        });
    }
};
const createEpisodeDoc = async (episode) => {
    try {
        const series = (await Series_1.default.findOne({ name: episode.series }));
        const season = await Season_1.default.findOne({
            name: episode.season,
            series: series._id,
        });
        let duration = await getMetadata(episode.path);
        const _s = episode.season.split(' ')[episode.season.split(' ').length - 1];
        const result = episode.episode
            ? await getEpisodeDetails(series.tmdb_id, _s, episode.episode)
            : null;
        await Media_1.default.create({
            path: episode.path,
            name: episode.name,
            duration,
            displayName: episode?.displayName || null,
            extension: episode.extension,
            size: episode.size,
            series: series._id,
            season: season._id,
            episode: episode.episode,
            episodeName: episode?.episodeName || result?.episodeName || null,
            date: result?.date || null,
            poster: result?.poster || null,
            description: result?.description || null,
            vote_average: result?.vote_average || null,
        });
    }
    catch (err) {
        console.log(err);
    }
};
const createMovieSeriesDoc = async (item, seriesId = '') => {
    if (!seriesId)
        return;
    let duration = await getMetadata(item.path);
    try {
        const episodeName = item.episodeName
            ? item.episodeName.replace('.', ' ')
            : item.episodeName;
        let str = `${item.displayName}`;
        if (episodeName)
            str = `${str} ${episodeName}`;
        const details = await getMediaDetails(str, SearchTypes.MOVIE, item.year);
        await Media_1.default.create({
            path: item.path,
            name: item.name,
            duration,
            displayName: item.displayName || null,
            extension: item.extension,
            size: item.size,
            series: seriesId,
            episode: item.episode || null,
            episodeName,
            ...details,
        });
    }
    catch (err) {
        console.log(err);
    }
};
const createStandaloneMovieDoc = async (item) => {
    // Get duration
    let duration = await getMetadata(item.path);
    // Get details from TMDB
    const result = await getMediaDetails(item.displayName, SearchTypes.MOVIE, item.year);
    try {
        await Media_1.default.create({
            path: item.path,
            name: item.name,
            duration,
            displayName: item.displayName || null,
            extension: item.extension,
            size: item.size,
            ...result,
        });
    }
    catch (err) {
        console.log(err);
    }
};
const dropCollections = async (req, res) => {
    try {
        await Series_1.default.collection.drop();
        await Season_1.default.collection.drop();
        await Media_1.default.collection.drop();
        return res.status(200).json({ message: 'Dropped all DB collections.' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error occured.' });
    }
};
exports.dropCollections = dropCollections;
/*
 * Gets all media items
 */
const getMedia = async (req, res) => {
    // get all media
    let result = await Media_1.default.find({ series: null })
        .populate('series season')
        .sort({ name: 'asc' });
    res.status(200).json(result);
};
exports.getMedia = getMedia;
/*
 * Gets all series
 */
const getSeries = async (req, res) => {
    // get all media
    let result = await Series_1.default.find().sort({ name: 'asc' });
    res.status(200).json(result);
};
exports.getSeries = getSeries;
/*
 * Gets all seasons within series
 */
const getSeasons = async (req, res) => {
    // get all media
    let result = await Season_1.default.find().sort({ name: 'asc' });
    res.status(200).json(result);
};
exports.getSeasons = getSeasons;
const getMediaFromSeries = async (req, res) => {
    let { id } = req.params;
    let result = await Media_1.default.find({ series: id, season: null }).sort({
        name: 'asc',
    });
    if (result.length !== 0)
        return res.status(200).json({ result, isMedia: true });
    result = await Season_1.default.find({ series: id }).sort({ name: 'asc' });
    return res.status(200).json({ result, isMedia: false });
};
exports.getMediaFromSeries = getMediaFromSeries;
const getMediaFromSeason = async (req, res) => {
    let { id } = req.params;
    let result = await Media_1.default.find({ season: id }).sort({ name: 'asc' });
    return res.status(200).json({ result, isMedia: true });
};
exports.getMediaFromSeason = getMediaFromSeason;
/*
 * Streams the selected file
 */
const streamMedia = async (req, res) => {
    let { id } = req.params;
    const result = await Media_1.default.findById(id);
    let path = result.path;
    // Range: bytes=0-
    const { range } = req.headers;
    if (!range) {
        res.status(400).send('Range header not provided.');
    }
    const { size } = (0, util_files_1.fileStats)(path);
    const CHUNK_SIZE = 10 ** 6; // 1 MB transferred per request
    // replace all non-digit characters
    const start = Number(range.replace(/\D/g, ''));
    // End should not pass the size of the media
    const end = Math.min(start + CHUNK_SIZE, size - 1);
    const length = end - start + 1;
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': length,
        'Content-Type': 'video/mp4',
    };
    const stream = fs_1.default.createReadStream(path, { start, end });
    // 206 - Partial content
    res.writeHead(206, headers);
    // stream the chunks to the client
    stream.pipe(res);
};
exports.streamMedia = streamMedia;
