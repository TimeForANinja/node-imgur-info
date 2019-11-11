/* global before, after */
const URL = require('url');
const PATH = require('path');
const NOCK = require('nock');

const IMGUR_HOST = 'https://imgur.com';
const GALLERY_PATH = '/gallery/';

before(() => { NOCK.disableNetConnect(); });
after(() => { NOCK.enableNetConnect(); });

exports = module.exports = (link, opts) => {
  const scopes = [];
  const urlParsed = URL.parse(link);

  if (opts.type === 'gallery') {
    scopes.push(
      NOCK(IMGUR_HOST)
        .get(GALLERY_PATH + urlParsed.path)
        .replyWithFile(opts.statusCode || 200, PATH.resolve(__dirname, 'files/page1.html')),
    );
  }

  if (opts.error) {
    scopes.push(
      NOCK(IMGUR_HOST)
        .get(GALLERY_PATH + urlParsed.path)
        .reply(400),
    );
  }
  if (opts.halfJSON) {
    scopes.push(
      NOCK(IMGUR_HOST)
        .get(GALLERY_PATH + urlParsed.path)
        .reply(opts.statusCode || 200, 'HELLO WORLD,"adConfig":{'),
    );
  }
  if (opts.invalidJSON) {
    scopes.push(
      NOCK(IMGUR_HOST)
        .get(GALLERY_PATH + urlParsed.path)
        .reply(opts.statusCode || 200, 'image : { HELLO WORLD,"adConfig":{'),
    );
  }
  if (opts.noCFG) {
    scopes.push(
      NOCK(IMGUR_HOST)
        .get(GALLERY_PATH + urlParsed.path)
        .reply(opts.statusCode || 200, 'HELLO WORLD'),
    );
  }

  return {
    ifError: err => { if (err) NOCK.cleanAll(); },
    done: () => scopes.forEach(scope => scope.done()),
  };
};
