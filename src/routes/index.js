

const express = require('express');
const path = require('path');
const _ = require('lodash');

// const logger = require('../tools/logger');
const routesHelper = require('../helpers/routes');

module.exports = (baseUrl) => {
    const router = express.Router();

    routesHelper.getRouteFiles((err, files) => {
        if (err) {
            console.log(`Error getting routes. No routes added. error: ${err}`);
        }

        files.forEach((file) => {
            router.use(baseUrl, require(path.join('..', '..', file)));
        });

        listRoutes(router, baseUrl).map((route) => {
            console.log('Registering route', route, '...');
        });
    });
    router.get('/health_check', (req, res, next) => {
        return res.status(200).json({
            Message: 'Healthy Server',
        });
    });
    return router;
};

const listRoutes = (router, baseUrl) => {
    var routes = [];
    if (router && router.stack) {
        router.stack.forEach((middleware) => {
            if (middleware && middleware.route) {
                routes.push(processRoute(middleware.route, baseUrl));
            } else if (
                middleware &&
        middleware.name &&
        middleware.name === 'router' &&
        _.has(middleware, 'handle.stack')
            ) {
                routes = routes.concat(
                    middleware.handle.stack.map((handler) => {
                        if (_.has(handler, 'route')) {
                            return processRoute(handler.route, baseUrl);
                        }
                    })
                );
            }
        });
    }
    return routes;
};

const processRoute = (route, baseUrl) => {
    const methods = Object.keys(route.methods)
        ? Object.keys(route.methods).toString().toUpperCase()
        : '';

    return `${methods} ${baseUrl}${route.path}`;
};
