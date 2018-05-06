const HTTPS = require('https');
const HOST = 'https://imgur.com/';

const getImgurImages = (rawUrl, callback) => { // eslint-disable-line consistent-return
  // Return a promise when no callback is provided
  if (!callback) {
    return new Promise((resolve, reject) => getImgurImages(rawUrl, (err, info) => {
      if (err) return reject(err);
      return resolve(info);
    }));
  }

  const url = parseURL(rawUrl);
  if (url instanceof Error) return callback(url);
  // Do the https request
  HTTPS.get(`${HOST}gallery/${url}`, resp => { // eslint-disable-line consistent-return
    if (resp.statusCode !== 200) return callback(new Error(`statusCode: ${resp.statusCode}`));
    const site = [];
    resp.on('data', d => site.push(d));
    resp.on('end', () => {
      const siteString = Buffer.concat(site).toString();
      // Get the config file
      const end = siteString.lastIndexOf(',"adConfig":{');
      const haystack = siteString.substring(0, end);
      const start = haystack.match(/image[ ]+: {/);
      if (!start) return callback(new Error('unable to find config'));
      const config = haystack.substring(start.index + start[0].length - 1);
      if (!config) return callback(new Error('unable to find config'));
      // Try to parse it and end
      try {
        return callback(null, JSON.parse(`${config}}`));
      } catch (e) {
        return callback(new Error('failed to parse config'));
      }
    });
  // Catch https errors
  }).on('error', callback);
};

const parseURL = url => {
  url = url.replace(HOST, '');
  if (url.match(/^[\w]+$/)) return url;
  if (!url.match(/^\/?gallery\/[\w]+$/)) return new Error('invalid id');
  return url.replace(/^\/?gallery\//, '');
};

module.exports = getImgurImages;
