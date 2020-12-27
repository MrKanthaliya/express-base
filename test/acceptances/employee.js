var request = require('supertest')
    , chai = require('chai');
var expect = chai.expect;
import app from './index';

describe('GET /employee', () => {
    let server;
    before(async() => {
        server = await app;
    });
    it('fetch employee lists and should respond with 200 code', (done) => {
        request(server)
            .get('/api/v1/employee')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('Object');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.be.an('String');
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.be.an('Array');
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});

describe('POST /employee', () => {
    let server;
    before(async() => {
        server = await app;
    });
    it('set provided value and should respond with 200 code', (done) => {
        request(server)
            .post('/api/v1/employee')
            .send({ first_name: 'example',
                last_name: 'example', email: `test-${Math.random().toString(36).substring(7)}@example.com` })
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('Object');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.be.an('String');
                if (err) {
                    return done(err);
                }
                done();
            });
    });

});
