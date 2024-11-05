import Joi from 'joi';

const createEvent = Joi.object({
    name: Joi.string().max(50).required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
    venue: Joi.string().max(100).required(),
    totalSeats: Joi.number().integer().greater(0).required(),
    availableSeats: Joi.number().integer().greater(-1).required(),
});

const updateEvent = Joi.object({
    name: Joi.string().max(50),
    startDate: Joi.date(),
    endDate: Joi.date(),
    venue: Joi.string().max(100),
    totalSeats: Joi.number().integer().greater(0),
    availableSeats: Joi.number().integer().greater(-1),
}).or('name', 'startDate', 'endDate', 'venue', 'totalSeats', 'availableSeats');

export default { createEvent, updateEvent };
