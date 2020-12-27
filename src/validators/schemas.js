

import Joi from 'joi';
import {
    stringSanitized,
    email,
    naturalNumber,
    pageLimit,
} from './validation';


const addEmployeeSchema = Joi.object({
    first_name: stringSanitized('first name').required(),
    middle_name: stringSanitized('middle name'),
    last_name: stringSanitized('last name').required(),
    email: email('email').required(),
});

const fetchEmployeeListSchema = Joi.object({
    page: naturalNumber('page').required(),
    limit: pageLimit('limit').required(),
});

export default {
    addEmployeeSchema,
    fetchEmployeeListSchema
};
