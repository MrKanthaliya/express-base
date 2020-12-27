const Joi = require('joi');
import format from 'string-format';
import xss from 'xss';


const KEY_EMPTY = 'The key {} should not be empty.';
const KEY_MISSING = 'The key {} should be present.';
const KEY_NOT_VALID_OPTION = 'The key {} should be a valid option.';
const INVALID_EMAIL = 'The key {} should be a valid email address.';
const INVALID_MONGO_OBJECT_ID = 'The key {} should be a valid Mongo ObjectID.';
const INVALID_TYPE = 'The key {} should be of type {}.';
const INVALID_GUID = 'The key {} should be a valid GUID.';
const STRING_OVER_MAXLENGTH = 'The key {} should be a maximum of {} characters long.';
const NUMBER_NOT_NATURAL = 'The key {} should be a natural number.';
const NUMBER_NOT_WHOLE = 'The key {} should be a whole number.';
const NUMBER_OVER_LIMIT = 'The key {} should fall within an upper limit of {}.';
const NUMBER_UNDER_LIMIT = 'The key {} should fall within a lower limit of {}.';
// const DATE_NOT_ISO = 'The key {} should be a valid ISO 8601 formatted date.';
// const DATE_NOT_YYYYMMDD = 'The key {} should be a valid date in YYYY:MM:DD format.';
// const DISALLOWED_STRING = 'The key {} is a disallowed value';
// const HEADER_MISSING = 'The header {} should be present.';
// const HEADER_EMPTY = 'The header {} should not be empty.';
// const HEADER_NOT_VALID_OPTION = 'The header {} should be a valid option.';
// const INVALID_ALPHA_3_CODE = 'The key {} should be a valid ISO 3166 Alpha-3 code.';
// const INVALID_BOOLEAN = 'The key {} should be a valid Boolean value.';
// const INVALID_CURRENCY = 'The key {} should be a valid ISO 4217 currency code.';
// const INVALID_HTTP_STATUS = 'The key {} should be a valid HTTP status code.';
// const INVALID_JWT = 'The key {} should be a valid JWT.';
// const INVALID_LOCALE = 'The key {} should be a valid ISO 639-2 locale.';
// const INVALID_PHONE_CODE = 'The key {} should be a valid ISD phone code.';
// const INVALID_PHONE_NUMBER = 'The key {} should be a valid phone number.';
// const INVALID_PNG_IMAGE = 'The key {} should be a valid PNG image.';
// const INVALID_PORT = 'The key {} should be a valid TCP port.';
// const INVALID_TIMEZONE = 'The key {} should be a valid ISO 8601 timezone.';
// const INVALID_URI = 'The key {} should be a valid URI.';
// const NUMBER_NEGATIVE = 'The key {} should not be negative.';
// const ARRAY_BELOW_MINLENGTH = 'The key {} should contain atleast {} entrie(s).';
// const ARRAY_ABOVE_MAXLENGTH = 'The key {} can only have a max of {} entrie(s).';

export const sanitizeXSS = (value) => {
    return xss(value, {
        whiteList: {}, // empty, means filter out all tags
        stripIgnoreTag: true, // filter out all HTML not in the whitelist
        stripIgnoreTagBody: ['script'], // the script tag is a special case, we need
        // to filter out its content
    });
};

export const string = (fieldName) =>
    Joi.string()
        .trim()
        .max(255)
        .messages({
            'any.required': format(KEY_MISSING, fieldName),
            'string.base': format(INVALID_TYPE, fieldName, 'string'),
            'string.empty': format(KEY_EMPTY, fieldName),
            'string.max': format(STRING_OVER_MAXLENGTH, fieldName, '255'),
        });

export const stringSanitized = (fieldName) => string(fieldName).custom(sanitizeXSS, 'XSS sanitization');

export const stringValue = (fieldName, values, defaultValue = null) => {
    const schema = Joi.string()
        .trim()
        .max(255)
        .valid(...values)
        .messages({
            'any.required': format(KEY_MISSING, fieldName),
            'any.only': format(KEY_NOT_VALID_OPTION, fieldName),
            'string.base': format(INVALID_TYPE, fieldName, 'string'),
            'string.empty': format(KEY_EMPTY, fieldName),
            'string.max': format(STRING_OVER_MAXLENGTH, fieldName, '255'),
        });

    if (defaultValue) {
        return schema.default(defaultValue);
    }

    return schema;
};

export const mongoObjectId = (fieldName) =>
    Joi.string()
        .hex()
        .length(24)
        .messages({
            'any.required': format(KEY_MISSING, fieldName),
            'string.base': format(INVALID_TYPE, fieldName, 'string'),
            'string.empty': format(KEY_EMPTY, fieldName),
            'string.hex': format(INVALID_MONGO_OBJECT_ID, fieldName),
            'string.length': format(INVALID_MONGO_OBJECT_ID, fieldName),
        });

export const email = (fieldName) =>
    Joi.string()
        .trim()
        .max(255)
        .email()
        .messages({
            'any.required': format(KEY_MISSING, fieldName),
            'string.base': format(INVALID_TYPE, fieldName, 'string'),
            'string.empty': format(KEY_EMPTY, fieldName),
            'string.max': format(STRING_OVER_MAXLENGTH, fieldName, '255'),
            'string.email': format(INVALID_EMAIL, fieldName),
        });

export const guid = (fieldName) =>
    Joi.string()
        .trim()
        .guid()
        .messages({
            'any.required': format(KEY_MISSING, fieldName),
            'string.base': format(INVALID_TYPE, fieldName, 'string'),
            'string.empty': format(KEY_EMPTY, fieldName),
            'string.guid': format(INVALID_GUID, fieldName),
        });

/**
         * whole number validation.
         * Validates if positive integer.
         * @param {string} fieldName name of the key
         */
export const wholeNumber = function(fieldName) {
    return Joi.number()
        .integer()
        .min(0)
        .messages({
            'any.required': format(KEY_MISSING, fieldName),
            'number.integer': format(NUMBER_NOT_WHOLE, fieldName),
            'number.min': format(NUMBER_NOT_WHOLE, fieldName),
        });
};
/**
         * Natural number validation.
         * Validates if positive integer.
         * @param {string} fieldName name of the key
         */
export const naturalNumber = function(fieldName) {
    return Joi.number()
        .integer()
        .positive()
        .messages({
            'any.required': format(KEY_MISSING, fieldName),
            'number.integer': format(NUMBER_NOT_NATURAL, fieldName),
            'number.min': format(NUMBER_NOT_NATURAL, fieldName),
        });
};

export const pageLimit = (fieldName) =>
    Joi.number()
        .integer()
        .min(10)
        .max(100)
        .example(10)
        .messages({
            'any.required': format(KEY_MISSING, fieldName),
            'number.integer': format(NUMBER_NOT_NATURAL, fieldName),
            'number.min': format(NUMBER_UNDER_LIMIT, fieldName, '10'),
            'number.max': format(NUMBER_OVER_LIMIT, fieldName, '100'),
        });
