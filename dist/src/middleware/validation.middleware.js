"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function validationMiddleware(schema) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };
        try {
            const value = yield schema.validateAsync(req.body, validationOptions);
            req.body = value;
            next();
        }
        catch (e) {
            const errors = {};
            e.details.forEach((error) => {
                var _a;
                const fieldName = (_a = error.context) === null || _a === void 0 ? void 0 : _a.key;
                if (fieldName) {
                    errors[fieldName] = error.message.replace(/['"]/g, '');
                }
            });
            res.status(400).send({
                message: 'Validation Error',
                errors,
            });
        }
    });
}
exports.default = validationMiddleware;
//# sourceMappingURL=validation.middleware.js.map