"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mediaSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Series',
        required: false,
    },
    season: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
});
exports.default = mongoose_1.default.model('Media', mediaSchema);
