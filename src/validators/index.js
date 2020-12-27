import schemas from './schemas';
const Boom = require('boom');

const validation = async(req, res, next) => {
    try {
        switch (req.path) {
            case '/api/v1/employee':
                if (req.method == 'POST') {
                    req.body = await schemas.addEmployeeSchema.validateAsync(req.body, {
                        stripUnknown: true,
                    });
                }
                break;
            default:
                break;
        }
        next();
    } catch (error) {
        console.log(error);
        const { details } = error;
        const message = details.map((i) => i.message).join(',');
        next(Boom.badRequest(message));
    }
};

export default validation;
