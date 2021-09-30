"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesFromPath = exports.fileStats = void 0;
const fs_1 = __importDefault(require("fs"));
const validExtensions = ['mp4', 'webm', 'mkv', 'avi', 'mpeg', 'mov'];
/**
 * Get file stats (size, last modified, created, etc)
 */
const fileStats = (path) => fs_1.default.statSync(path);
exports.fileStats = fileStats;
const isFile = (stats, extension) => stats.size !== 0 && validExtensions.includes(extension);
const getExtension = (file) => file.split('.')[file.split('.').length - 1];
/**
 * Get array of files or folders.
 */
const getFilesFromPath = (path) => fs_1.default
    .readdirSync(path)
    .map((file, index) => {
    const extension = getExtension(file);
    const { size } = (0, exports.fileStats)(`${path}/${file}`);
    let _file = file.replace(/\./g, ' ');
    if (validExtensions.includes(extension)) {
        const name = _file.replace(`.${extension}`, '');
        return {
            name,
            path: `${path}/${file}`,
            isFile: isFile((0, exports.fileStats)(`${path}/${file}`), extension),
            isFolder: size === 0,
            size: size,
            extension,
        };
    }
    else {
        return {
            name: _file,
            path: `${path}/${file}`,
            isFile: isFile((0, exports.fileStats)(`${path}/${file}`), extension),
            isFolder: size === 0,
            size: size,
        };
    }
})
    .filter((file) => file.isFile || file.isFolder);
exports.getFilesFromPath = getFilesFromPath;
