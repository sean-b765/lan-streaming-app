"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const seriesSchema = new mongoose_1.default.Schema({
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
});
exports.default = mongoose_1.default.model('Series', seriesSchema);
