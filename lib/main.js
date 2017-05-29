const https = require('https');

const get_imgur_images = function(url, callback) {
	// return a promise when no callback is provided
	if (!callback) {
		return new Promise(function(resolve, reject) {
			get_imgur_images(url, function(err, info) {
				if (err) return reject(err);
				resolve(info);
			});
		});
	}
	// do the http request
	https.get(url,resp => {
		let site = '';
		resp.on('data',d => {
			site += d.toString();
		});
		resp.on('end',() => {
			// get the config file
			let end = site.lastIndexOf(',"adConfig":{');
			let haystack = site.substring(0, end);
			let start = haystack.match(/image[ ]+: {/);
			let config = haystack.substring(start.index + start[0].length - 1);
			// try to parse it and end
			try {
				return callback(null, JSON.parse(config + '}'));
			} catch(e) {
				return callback('error parsing config: ' + e);
			}
		});
	// catch https errors
	}).on('error', e => {
		return callback(e);
	});
}

module.exports = get_imgur_images;
