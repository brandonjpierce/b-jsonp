var test = require('tape');
var jsonp = require('../dist/b-jsonp.min');
var endpoint = 'https://jsfiddle.net/echo/jsonp/';

test('basic call', function(t) {
  jsonp(endpoint, function(err, response) {
    t.ok(response, 'Response is not null');
    t.error(err, 'Error is null');
    t.end();
  });
});

test('data', function(t) {
  var data = { foo: 'Hello 123 % > !' };

  jsonp(endpoint, data, function(err, response) {
    t.ok(response, 'Response is not null');
    t.error(err, 'Error is null');
    t.deepEqual(data, response, 'Response data is equal to what was sent in request');
    t.end();
  });
});

test('named callback', function(t) {
  var data = { foo: 'bar' };

  jsonp(endpoint, data, { name: 'namedCb' }, function(err, response) {
    t.ok(response, 'Response is not null');
    t.error(err, 'Error is null');
    t.deepEqual(data, response, 'Response data is equal to what was sent in request');
    t.end();
  });
});

test('timeout', function(t) {
  jsonp(endpoint, { delay: 2 }, { timeout: 1000 }, function(err, response) {
    t.ok(err instanceof Error, 'Error in callback, is not null, and instance of Error');
    t.end();
  });
});
