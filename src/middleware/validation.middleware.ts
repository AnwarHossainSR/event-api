/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, RequestHandler, Response } from 'express';
import Joi from 'joi';

function validationMiddleware(schema: Joi.Schema): RequestHandler {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        try {
            const value = await schema.validateAsync(
                req.body,
                validationOptions
            );
            req.body = value;
            next();
        } catch (e: any) {
            const errors: Record<string, string> = {};
            e.details.forEach((error: Joi.ValidationErrorItem) => {
                const fieldName = error.context?.key;
                if (fieldName) {
                    errors[fieldName] = error.message.replace(/['"]/g, '');
                }
            });
            res.status(400).send({
                message: 'Validation Error',
                errors,
            });
        }
    };
}

export default validationMiddleware;
