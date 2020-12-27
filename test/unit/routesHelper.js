

var chai = require('chai')
    , rewire = require('rewire');

var routeHelper = rewire('../../src/helpers/routes')
    , expect = chai.expect;

describe('Route Helper getRouteFiles', () => {
    const getRouteFiles = routeHelper.__get__('getRouteFiles');
    it('should return an a list of files', (done) => {
        getRouteFiles((err, routes) => {
            expect(err).to.be.null;
            expect(routes).to.have.length.above(0);
            done();
        });
    });

    it('should return an a list of files', (done) => {
        routeHelper.__set__('routesFolder', './dasdsd');
        getRouteFiles((err, routes) => {
            expect(err).to.be.null;
            expect(routes).to.be.be.deep.equal([]);
            done();
        });
    });
});

