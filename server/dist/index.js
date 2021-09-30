"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const files_1 = __importDefault(require("./routes/files"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use('/files', files_1.default);
app.listen(5000, () => {
    console.log(`Server running on port ${5000}`);
});
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then((res) => {
    console.log(`Connected to MongoDB!`);
})
    .catch((err) => {
    console.log(`Failed to connect to MongoDB`);
});
