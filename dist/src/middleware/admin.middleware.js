"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = __importDefault(require("../utils/exceptions/http.exception"));
// Admin middleware that assumes authenticatedMiddleware has already been applied
function adminMiddleware(req, _res, next) {
    const user = req.user;
    if (!user || user.role !== 'ADMIN') {
        return next(new http_exception_1.default(403, 'Forbidden: Admins only'));
    }
    return next();
}
exports.default = adminMiddleware;
//# sourceMappingURL=admin.middleware.js.map