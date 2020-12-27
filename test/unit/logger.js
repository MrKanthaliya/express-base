

var chai = require('chai')
    , rewire = require('rewire')
    , loggerFixtures = require('./fixtures/logger');

var logger = rewire('../../src/tools/logger')
    , expect = chai.expect;

describe('Logger processTransport', () => {
    const processTransport = logger.__get__('processTransport');

    it('should return an exception if no config.type is passed', () => {
        const invalidTransport = loggerFixtures.invalidTransport;
        const error = 'Can\'t create logger transport.';
        expect(() => processTransport(invalidTransport).to.throw(error));
    });

    it('should return a winston.transports.Console object', () => {
        const result = processTransport(loggerFixtures.consoleTransport);
        const winston = require('winston');
        expect(result instanceof winston.transports.Console).to.be.true;
    });
});

describe('Logger getDefaultOptions', () => {
    const getDefaultOptions = logger.__get__('getDefaultOptions');

    it('should add timestamp and formatter default options', () => {
        const options = loggerFixtures.consoleTransport.options;
        expect(getDefaultOptions(options).timestamp).to.be.a('function');
        expect(getDefaultOptions(options).formatter).to.be.a('function');
    });
});
