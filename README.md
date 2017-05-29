# node-imgur-info

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
### imgur_info(url, [callback])

Attempts to resolve the given playlist id

* `url`
* `callback(err, result)`
    * function
    * getting fired after the request is done

* returns a Promise when no callback is defined


# Install

    npm install --save imgur-info



# License
MIT
