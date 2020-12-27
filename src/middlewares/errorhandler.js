import logger from '../tools/logger';

const errorhandler = async(error, req, res, next) => {
    logger.error('Error:', { error });
    if (error.isBoom) {
        if (process.env.ENVIRONMENT === 'development' || process.env.ENVIRONMENT === 'stage') {
            error.output.payload.stack = error.stack;
        }
        return res.status(error.output.statusCode).json(error.output.payload);
    }
    if (process.env.ENVIRONMENT === 'development' || process.env.ENVIRONMENT === 'stage') {
        return res.status(500).json({ error: error.message, stack: error.stack });
    } else {
        return res.status(500).json({ error: 'Bad implementation'});
    }
};

export default errorhandler;
