import connectToDB from '../database';
import MongoCommonService from '../service/repository/common';
import CacheService from '../service/cache/index';
const MailClient = require('@sendgrid/mail');
import logger from '../tools/logger';
import format from 'string-format';

export const initializeServerBase = async(app) => {

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    format.extend(String.prototype, {});

    try {

        const redisCache = new CacheService();
        const redisClient = await redisCache.init();
        logger.info('Redis Cache initiated');
        const ExpressGlobals = {
            cache: redisCache,
            redis_client: redisClient,
        };
        Object.freeze(ExpressGlobals);

        global.ExpressGlobals = ExpressGlobals;

        const mongo = await connectToDB();
        logger.info('Database connected');
        await new MongoCommonService(mongo);

        MailClient.setApiKey(SENDGRID_API_KEY); // Sendgrid email setup
        logger.info('Sendgrid initiated');
        app.set('server', {
            mongo,
            MailClient,
        });
    } catch (error) {
        logger.error('Server failed to start.', error);
        process.exit(1);
    }
};
