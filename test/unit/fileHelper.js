

var chai = require('chai')
    , rewire = require('rewire');

var fileHelper = rewire('../../src/helpers/file')
    , expect = chai.expect;

describe('File Helper directoryExists', () => {
    const directoryExists = fileHelper.__get__('directoryExists');
    it('should return an error if directory does not exist', (done) => {
        directoryExists('daskdsa/', (err, exists) => {
            expect(err).to.be.null;
            expect(exists).to.be.false;
            done();
        });
    });

    it('should return a boolean equals to true if directory exists', (done) => {
        directoryExists('src/', (err, exists) => {
            expect(err).to.be.null;
            expect(exists).to.be.true;
            done();
        });
    });
});

describe('File Helper getFilesFromDir', () => {
    const getFilesFromDir = fileHelper.__get__('getFilesFromDir');
    it('should return an error if directory does not exist', (done) => {
        getFilesFromDir('daskdsa/', (err, files) => {
            expect(err.code).to.exist;
            expect(files).to.not.exist;
            done();
        });
    });

    it('should return a list of files if directory exists', (done) => {
        getFilesFromDir('src', (err, files) => {
            expect(err).to.not.exist;
            expect(files).to.have.length.above(0);
            done();
        });
    });
});

