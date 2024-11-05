import Joi from 'joi';

const create = Joi.object({
    userId: Joi.string().required(),
    eventId: Joi.string().required(),
    seats: Joi.number().integer().positive().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
});

export default { create };
