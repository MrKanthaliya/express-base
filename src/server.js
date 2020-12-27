import compression from 'compression';
import express from 'express';
import methodOverride from 'method-override';
import { json, urlencoded } from 'body-parser';
import { join } from 'path';
import helmet from 'helmet';
import { config } from 'dotenv';
config({ path: `${__dirname}/../.env` });
import cors from 'cors';
import errorhandler from './middlewares/errorhandler';
import { initializeServerBase } from './helpers';

const testReports = require('./tools/test-reports');
const swagger = require('./tools/swagger');
import validation from './validators';

export var app;

export const start = async(port, protocol, baseUrl, routesFolderPath) => {
    init(baseUrl, routesFolderPath);
    var http = require(protocol);
    const params = [app];
    const server = http.createServer
        .apply(this, params);

    server
        .listen(port, () => {
            const message = `is listening to all incoming requests in port ${port}`;
            console.log('Process', process.pid, message);
        })
        .on('error', (err) => {
            console.log(err.message);
        });

};

const init = async(baseUrl, routesFolderPath) => {
    app = express();
    app.use(
        cors({
            origin: '*',
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: false,
            methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
        })
    );

    await initializeServerBase(app);
    app.use(methodOverride());
    app.use(compression());
    app.use(helmet());
    app.use(json());
    app.use(urlencoded({ extended: false }));

    testReports.init(app);

    swagger.init(app);
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            console.error(err);
            return res.status(400).send({ message: err.message }); // Bad request
        }
        next();
    });

    app.use(validation);
    app.use(require(join(__dirname, '../', routesFolderPath))(baseUrl));

    // error handler route must be placed in the end
    app.use(errorhandler);

    process.on('uncaughtException', (err) => {
        console.error(
            new Date().toUTCString() + ' uncaughtException:',
            err.message
        );
        console.error(err.stack);
        process.exit(1);
    });

    return app;
};

export const test = init;
