import HttpException from '../utils/exceptions/http.exception';
import Token from '../utils/interfaces/token.interface';
import token from '../utils/token';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function authenticatedMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorized'));
    }

    const accessToken = bearer.split('Bearer ')[1].trim();
    try {
        const payload: Token | jwt.JsonWebTokenError =
            await token.verifyToken(accessToken);

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Unauthorized'));
        }

        // Handle ObjectId conversion to string safely
        const userId =
            typeof payload.id === 'object'
                ? (payload.id as unknown as string)
                : payload.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, role: true, name: true },
        });

        if (!user) {
            return next(new HttpException(401, 'Unauthorized'));
        }

        req.user = user; // Make sure req.user is of type User

        return next();
    } catch (error) {
        return next(new HttpException(401, 'Unauthorized'));
    }
}

export default authenticatedMiddleware;
