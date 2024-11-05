import HttpException from '../utils/exceptions/http.exception';
import { NextFunction, Request, Response } from 'express';

// Admin middleware that assumes authenticatedMiddleware has already been applied
function adminMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
): Response | void {
    const user = req.user;

    if (!user || user.role !== 'ADMIN') {
        return next(new HttpException(403, 'Forbidden: Admins only'));
    }

    return next();
}

export default adminMiddleware;
