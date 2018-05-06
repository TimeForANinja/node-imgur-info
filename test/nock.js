const url  = require('url');
const path = require('path');
const nock = require('nock');

const IMGUR_HOST   = 'https://imgur.com';
const GALLERY_PATH = '/gallery/';

before(() => { nock.disableNetConnect(); });
after(() => { nock.enableNetConnect(); });

exports = module.exports = (link, opts) => {
  var scopes = [];
  var urlParsed = url.parse(link);

  if(opts.type === 'gallery') {
    scopes.push(
      nock(IMGUR_HOST)
        .get(GALLERY_PATH + urlParsed.path)
        .replyWithFile(opts.statusCode || 200, path.resolve(__dirname, 'files/page1.html'))
    );
  }

  if(opts.error) {
    scopes.push(
      nock(IMGUR_HOST)
        .get(GALLERY_PATH + urlParsed.path)
        .reply(400)
    );
  }
  if(opts.halfJSON) {
    scopes.push(
      nock(IMGUR_HOST)
        .get(GALLERY_PATH + urlParsed.path)
        .reply(opts.statusCode || 200, 'HELLO WORLD,"adConfig":{')
    );
  }
  if(opts.invalidJSON) {
    scopes.push(
      nock(IMGUR_HOST)
        .get(GALLERY_PATH + urlParsed.path)
        .reply(opts.statusCode || 200, 'image : { HELLO WORLD,"adConfig":{')
    );
  }
  if(opts.noCFG) {
    scopes.push(
      nock(IMGUR_HOST)
        .get(GALLERY_PATH + urlParsed.path)
        .reply(opts.statusCode || 200, 'HELLO WORLD')
    );
  }

  return {
    ifError: (err) => {if(err) nock.cleanAll()},
    done: () => scopes.forEach(scope => scope.done())
  }
}
