"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorMiddleware(error, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) {
    const status = error.status || 500;
    let message = error.message || 'Something went wrong';
    // Wrong JWT error
    if (error.name === 'JsonWebTokenError') {
        message = `Json Web Token is invalid, Try again `;
    }
    // JWT EXPIRE error
    if (error.name === 'TokenExpiredError') {
        message = `Json Web Token is Expired, Try again `;
    }
    res.status(status).send({
        status,
        message,
    });
}
exports.default = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map