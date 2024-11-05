"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/'); // Specify the directory where files will be stored
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    },
});
const upload = (0, multer_1.default)({ storage: storage });
exports.upload = upload;
//# sourceMappingURL=multerHelper.js.map