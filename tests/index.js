const tape = require('tape');
const qs = require('querystring');
const jsonp = require('../src');
const endpoint = 'http://jsfiddle.net/echo/jsonp/';

tape('basic jsonp call', function(t) {
  t.plan(2);

  var data = { foo: 'bar' };
  var q = qs.encode(data);
  jsonp(endpoint + '?' + q, function(err, response) {
    t.deepEqual(data, response);
    t.error(err);
  });
});

tape('jsonp timeout', function(t) {
  t.plan(1);

  var data = { delay: 4 };
  var q = qs.encode(data);
  jsonp(endpoint + '?' + q, null, { timeout: 3000 }, function(err, response) {
    t.ok(err instanceof Error);
  });
})
