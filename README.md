# b-jsonp

[![npm](https://img.shields.io/npm/dt/b-jsonp.svg?style=flat-square)]()

A simple, efficient, and small jsonp library for the browser.

## Usage

#### Simple request

```javascript
jsonp('http://your/url', function(err, response) {
  if (err) {
    console.log(err);
  } else {
    console.log(response);
  }
});
```

#### Passing data
```javascript
jsonp('http://your/url', { foo: 'bar' }, function(err, response) {
  if (err) {
    console.log(err);
  } else {
    console.log(response);
  }
});
```

#### Additional options
```javascript
jsonp(
  'http://your/url', // url to send to
  { foo: 'bar' }, // data
  {
    timeout: 3000, // how long to wait before timing out
    name: 'callbackz', // name of callback method key in url
    prefix: '__abc123' // prefix for created global jsonp methods
  },
  function(err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    }
  }
);
```
