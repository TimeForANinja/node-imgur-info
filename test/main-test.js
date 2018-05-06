/* global describe, it */
const IMGUR = require('..');
const NOCK = require('./nock');
const FS = require('fs');
const PATH = require('path');
const ASSERT = require('assert-diff');

describe('main()', () => {
  it('regular usage', done => {
    FS.readFile(PATH.resolve(__dirname, 'files/parsed.json'), (err, data) => {
      ASSERT.ifError(err);
      const dataOut = JSON.parse(data);
      const plistID = 'no3t9ib';
      const scope = NOCK(plistID, {
        type: 'gallery',
      });
      IMGUR(`https://imgur.com/gallery/${plistID}`, (errIn, dataIn) => {
        scope.ifError(errIn);
        ASSERT.ifError(errIn);
        ASSERT.deepEqual(dataIn, dataOut);
        scope.done();
        done();
      });
    });
  });

  it('regular usage promise', done => {
    FS.readFile(PATH.resolve(__dirname, 'files/parsed.json'), (err, data) => {
      ASSERT.ifError(err);
      const dataOut = JSON.parse(data);
      const plistID = 'no3t9ib';
      const scope = NOCK(plistID, {
        type: 'gallery',
      });
      IMGUR(`https://imgur.com/gallery/${plistID}`).then(dataIn => {
        ASSERT.deepEqual(dataIn, dataOut);
        scope.done();
        done();
      }).catch(errIn => {
        scope.ifError(errIn);
        ASSERT.ifError(errIn);
      });
    });
  });

  it('should faild promise', done => {
    const plistID = 'no3t9ib';
    const scope = NOCK(plistID, {
      error: true,
    });
    IMGUR(`https://imgur.com/gallery/${plistID}`).catch(err => {
      ASSERT.equal(err.message, 'statusCode: 400');
      scope.done();
      done();
    });
  });

  it('half json', done => {
    const plistID = 'no3t9ib';
    const scope = NOCK(plistID, {
      halfJSON: true,
    });
    IMGUR(`https://imgur.com/gallery/${plistID}`).catch(err => {
      ASSERT.equal(err.message, 'unable to find config');
      scope.done();
      done();
    });
  });

  it('invalid json', done => {
    const plistID = 'no3t9ib';
    const scope = NOCK(plistID, {
      invalidJSON: true,
    });
    IMGUR(`https://imgur.com/gallery/${plistID}`).catch(err => {
      ASSERT.equal(err.message, 'failed to parse config');
      scope.done();
      done();
    });
  });

  it('no CFG', done => {
    const plistID = 'no3t9ib';
    const scope = NOCK(plistID, {
      noCFG: true,
    });
    IMGUR(`https://imgur.com/gallery/${plistID}`).catch(err => {
      ASSERT.equal(err.message, 'unable to find config');
      scope.done();
      done();
    });
  });

  it('shortened id', done => {
    FS.readFile(PATH.resolve(__dirname, 'files/parsed.json'), (err, data) => {
      ASSERT.ifError(err);
      const dataOut = JSON.parse(data);
      const plistID = 'no3t9ib';
      const scope = NOCK(plistID, {
        type: 'gallery',
      });
      IMGUR(plistID).then(dataIn => {
        ASSERT.deepEqual(dataIn, dataOut);
        scope.done();
        done();
      }).catch(errIn => {
        scope.ifError(errIn);
        ASSERT.ifError(errIn);
      });
    });
  });

  it('invalid id', done => {
    IMGUR('https://imgur.com/gallerya/no3t9ib').catch(err => {
      ASSERT.equal(err.message, 'invalid id');
      done();
    });
  });
});
