

var config = require('config'),
    winston = require('winston'),
    _ = require('lodash');

var logger = winston.createLogger({ transports: initTransports() });

function initTransports() {
    let transports =
        _.has(config, 'logger.transports') && _.isArray(config.logger.transports) ? config.logger.transports : [];

    transports = transports.map((transport) => {
        return processTransport(transport);
    });

    return transports;
}

function processTransport(transport) {
    if (!_.has(transport, 'config.type')) {
        throw new Error("Can't create logger transport.");
    }

    const type = _.get(winston, transport.config.type);

    return new type(getDefaultOptions(transport.options));
}

function getDefaultOptions(options) {
    options = !options ? {} : options;

    const defaultOptions = {
        timestamp: function() {
            const date = new Date();
            return (
                date.getDate() +
                '/' +
                date.getMonth() +
                '/' +
                date.getFullYear().toString().substr(2, 2) +
                ' ' +
                date.getHours() +
                ':' +
                date.getMinutes() +
                ':' +
                date.getSeconds()
            );
        },
        formatter: function(options) {
            const level = options.level;
            let result = `${options.timestamp()}`;
            result += `${winston.config.colorize(level, level.toUpperCase())}`;
            result += ` ${undefined !== options.message ? options.message : ''}`;
            result += options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '';
            return result;
        },
    };

    for (const option in defaultOptions) {
        options[option] = defaultOptions[option];
    }

    return options;
}

module.exports = logger;
