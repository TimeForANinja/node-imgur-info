const https = require('https');
const HOST  = 'https://imgur.com/';

const get_imgur_images = function(rawUrl, callback) {
  // return a promise when no callback is provided
  if (!callback) {
    return new Promise(function(resolve, reject) {
      get_imgur_images(rawUrl, function(err, info) {
        if (err) return reject(err);
        resolve(info);
      });
    });
  }

  let url = parseURL(rawUrl);
  if(url instanceof Error) return callback(url);
  // do the http request
  https.get(HOST +'gallery/'+ url, resp => {
    if(resp.statusCode !== 200) return callback(new Error('statusCode: '+ resp.statusCode));
    let site = [];
    resp.on('data', d => site.push(d));
    resp.on('end', () => {
      site = Buffer.concat(site).toString()
      // get the config file
      let end = site.lastIndexOf(',"adConfig":{');
      let haystack = site.substring(0, end);
      let start = haystack.match(/image[ ]+: {/);
      if(!start) return callback(new Error('unable to find config'));
      let config = haystack.substring(start.index + start[0].length - 1);
      if(!config) return callback(new Error('unable to find config'));
      // try to parse it and end
      try {
        return callback(null, JSON.parse(config + '}'));
      } catch(e) {
        return callback(new Error('failed to parse config'));
      }
    });
  // catch https errors
  }).on('error', callback);
}

const parseURL = function(url) {
  url = url.replace(HOST, '');
  if(url.match(/^[\w]+$/)) return url;
  if(!url.match(/^\/?gallery\/[\w]+$/)) return new Error('invalid id');
  return url.replace(/^\/?gallery\//, '');
}

module.exports = get_imgur_images;
