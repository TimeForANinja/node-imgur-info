# node-imgur-info

[![Greenkeeper badge](https://badges.greenkeeper.io/TimeForANinja/node-imgur-info.svg)](https://greenkeeper.io/)

Simple js only module to resolve Imgur albums without using a token

# Usage

```js
var imgur_info = require('imgur-info');

imgur_info('https://imgur.com/a/some_album', function(err, info) {
	if(err) throw err;
	dosth(info);
});
```


# API
### imgur_info(ref, [callback])

Attempts to resolve the given playlist id

* `ref`
    * ether a direct link like `https://imgur.com/gallery/no3t9ib`
		* just the page `/gallery/no3t9ib`
		* just the id `no3t9ib`
* `callback(err, result)`
    * function
    * getting fired after the request is done

* returns a Promise when no callback is defined


# Install

    npm install --save imgur-info



# License
MIT
