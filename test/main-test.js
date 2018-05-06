const imgur  = require('..');
const nock   = require('./nock');
const fs     = require('fs');
const path   = require('path');
const assert = require('assert-diff');

describe('main()', () => {
  it('regular usage', (done) => {
    fs.readFile(path.resolve(__dirname, 'files/parsed.json'), (err, data) => {
      assert.ifError(err);
      const dataOut = JSON.parse(data);
      let plistID = 'no3t9ib';
      let scope = nock(plistID, {
        type: 'gallery'
      });
      imgur('https://imgur.com/gallery/' + plistID, (err, dataIn) => {
        scope.ifError(err);
        assert.ifError(err);
        assert.deepEqual(dataIn, dataOut);
        scope.done();
        done();
      });
    });
  });

  it('regular usage promise', (done) => {
    fs.readFile(path.resolve(__dirname, 'files/parsed.json'), (err, data) => {
      assert.ifError(err);
      const dataOut = JSON.parse(data);
      let plistID = 'no3t9ib';
      let scope = nock(plistID, {
        type: 'gallery'
      });
      imgur('https://imgur.com/gallery/' + plistID).then(dataIn => {
        assert.deepEqual(dataIn, dataOut);
        scope.done();
        done();
      }).catch(err => {
        scope.ifError(err);
        assert.ifError(err);
      });
    });
  });

  it('should faild promise', (done) => {
    let plistID = 'no3t9ib';
    let scope = nock(plistID, {
      error: true
    });
    imgur('https://imgur.com/gallery/' + plistID).catch(err => {
      assert.equal(err.message, 'statusCode: 400');
      scope.done();
      done();
    });
  });

  it('half json', (done) => {
    let plistID = 'no3t9ib';
    let scope = nock(plistID, {
      halfJSON: true
    });
    imgur('https://imgur.com/gallery/' + plistID).catch(err => {
      assert.equal(err.message, 'unable to find config');
      scope.done();
      done();
    });
  });

  it('invalid json', (done) => {
    let plistID = 'no3t9ib';
    let scope = nock(plistID, {
      invalidJSON: true
    });
    imgur('https://imgur.com/gallery/' + plistID).catch(err => {
      assert.equal(err.message, 'failed to parse config');
      scope.done();
      done();
    });
  });

  it('no CFG', (done) => {
    let plistID = 'no3t9ib';
    let scope = nock(plistID, {
      noCFG: true
    });
    imgur('https://imgur.com/gallery/' + plistID).catch(err => {
      assert.equal(err.message, 'unable to find config');
      scope.done();
      done();
    });
  });

  it('shortened id', (done) => {
    fs.readFile(path.resolve(__dirname, 'files/parsed.json'), (err, data) => {
      assert.ifError(err);
      const dataOut = JSON.parse(data);
      let plistID = 'no3t9ib';
      let scope = nock(plistID, {
        type: 'gallery'
      });
      imgur(plistID).then(dataIn => {
        assert.deepEqual(dataIn, dataOut);
        scope.done();
        done();
      }).catch(err => {
        scope.ifError(err);
        assert.ifError(err);
      });
    });
  });

  it('invalid id', (done) => {
    imgur('https://imgur.com/gallerya/no3t9ib').catch(err => {
      assert.equal(err.message, 'invalid id');
      done();
    });
  });
});
