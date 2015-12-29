# b-jsonp

[![npm](https://img.shields.io/npm/dt/b-jsonp.svg)]()
[![Build Status](https://travis-ci.org/brandonjpierce/b-jsonp.svg?branch=master)](https://travis-ci.org/brandonjpierce/b-jsonp)
[![Code Climate](https://codeclimate.com/github/brandonjpierce/b-jsonp/badges/gpa.svg)](https://codeclimate.com/github/brandonjpierce/b-jsonp)

A simple, efficient, and small jsonp library for the browser.

## Install

With NPM:
```
npm install b-jsonp --save
```

Manual Install:
```
<script src="/path/to/b-jsonp.min.js"></script>
```

## Usage

All data passed to `b-jsonp` will automatically be URL encoded. `b-jsonp` is also aware if a URL currently contains a `?` and will adjust the request URL accordingly.

##### Simple request

```javascript
jsonp('http://your/url', function(err, response) {
  // your code here
});
```

##### Passing data
```javascript
jsonp('http://your/url', { foo: 'bar' }, function(err, response) {
  // your code here
});
```

##### Additional options
```javascript
jsonp('http://your/url', { foo: 'bar' }, { name: 'cb' }, function(err, response) {
  // your code here
});

// OR WITH NO DATA
//
jsonp('http://your/url', null, { name: 'cb' }, function(err, response) {
  // your code here
});
```
## Available options

Option | Type | Default | Description
------ | ---- | ------- | -----------
name | String | null | Name of function to be called by the jsonp callback. By default one is generated for you.
param | String | 'callback' | Name of callback parameter in URL
prefix | String | '__jsonp' | Prefix used when a callback name is generated automatically
timeout | Number | 15000 | Time to wait in milliseconds until the jsonp request is canceled

## License
MIT
