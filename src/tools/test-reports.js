

var config = require('config'),
    express = require('express');

var logger = require('./logger');
var fileHelper = require('../helpers/file');

function init(app) {
    if (config.has('test.reports.url') && config.has('test.reports.path')) {
        const url = config.test.reports.url;
        const path = config.test.reports.path;
        app.use(url, express.static(path));

        fileHelper.directoryExists(path, (err, exists) => {
            if (exists) {
                logger.info(`Test coverage reports available in ${url}`);
            } else {
                logger.info(
                    'Test coverage reports not available.',
                    ' Please execute command `npm run coverage.'
                );
            }
        });
    }
}

module.exports = {
    init: init,
};
