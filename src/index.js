(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.jsonp = factory();
  }
}(this, function() {

  /**
   * Private variables
   */
  var root = this;
  var doc = document;
  var enc = encodeURIComponent;

  /**
   * Generate a random prefix identifier
   * @method rand
   * @param  {Integer} length The length of the random string
   * @return {String} Our randomly generated string
   */
  function rand(length) {
    length = length || 5;

    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var possibleLength = possible.length;

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possibleLength));
    }

    return text;
  }

  /**
   * Determines if a value is a function
   * @param {Mixed} value The value we want to check
   * @return {Boolean} Whether the value is a function
   */
  function isFunction(value) {
    var functionTag = '[object Function]';
    var protoToString = Object.prototype.toString;
    return protoToString.call(value) == functionTag;
  }

  /**
   * Appends a script to the head tag
   * @param {String} src The src of the new script tag
   * @return {Object} The newly inject script node
   */
  function addScript(src, onError) {
    var target = doc.getElementsByTagName('head')[0];
    var script = doc.createElement('script');

    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = removeScript;
    target.appendChild(script);

    return script;
  }

  /**
   * Removes generated script node and event listeners
   */
  function removeScript() {
    if (this && this.parentNode) {
      this.onload = null;
      this.onerror = null;
      this.parentNode.removeChild(this);
    }
  }

  /**
   * Generates a temporary function name for global jsonp function
   * @param  {String} prefix A prefix for the function name
   * @return {String} The prefix + random identifier
   */
  function getTmpName(prefix) {
    return prefix + '__' + rand();
  }

  /**
   * Generates an encoded url string to be used in GET request
   * @param {String} url The base URL we want to send our request to
   * @param {Object} data Data we want to pass along
   * @param {String} method The callback parameter name
   * @param {String} cb The unique generated callback name
   * @return {String} The full formatted url string to send request to
   */
  function getUrl(url, data, method, tmp) {
    var query = url.indexOf('?') === -1 ? '?' : '&';

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        query += enc(key) + '=' + enc(data[key]) + '&';
      }
    }

    return url + query + method + '=' + tmp;
  }

  /**
   * Clears a timer and resets its value to null
   * @param {Integer} timer The timer integer
   */
  function clearTimer(timer) {
    clearTimeout(timer);
    timer = null;
  }

  /**
   * Public jsonp function
   * @method jsonp
   * @param {String} url The URL we want to send GET request to
   * @param {Object} data The data we want to pass to the url via querystring
   * @param {Object} opts Options for our jsonp request
   * @param {Function} cb Callback function to be called on GET request
   */
  function jsonp(url, data, opts, cb) {
    // function overloading
    if (isFunction(data)) {
      cb = data;
      data = {};
      opts = {};
    }

    // function overloading
    if (isFunction(opts)) {
      cb = opts;
      opts = {};
    }

    var timeout = opts.timeout || 15000;
    var prefix = opts.prefix || '__jsonp';
    var param = opts.param || 'callback';
    var name = opts.name || getTmpName(prefix);
    var query = getUrl(url, data, param, name);

    // create timeout for request
    var timer = setTimeout(function() {
      cb(new Error('jsonp request for ' + name + ' timed out.'), null);
      clearTimer(timer);
    }, timeout);

    // create our temporary global function
    root[name] = function(response) {
      cb(null, response);
      clearTimer(timer);
      root[name] = null;
    }

    // add script to document and setup error handler
    var script = addScript(query);
    script.onerror = function() {
      cb(new Error('jsonp encountered an error while loading injected script.'), null);
      clearTimer(timer);
    }
  }

  return jsonp;
}));
