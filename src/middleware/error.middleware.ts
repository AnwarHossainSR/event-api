import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/exceptions/http.exception';

function errorMiddleware(
    error: HttpException,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
): void {
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

export default errorMiddleware;
