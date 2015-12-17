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
  var root = window;
  var doc = document;
  var counter = 0;

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
   * @return {String} The prefix + counter
   */
  function getTmpName(prefix) {
    return prefix + (++counter);
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
        query += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
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
    var method = opts.name || 'callback';
    var tmpName = getTmpName(prefix);
    var query = getUrl(url, data, method, tmpName);

    // create timeout for request
    var timer = setTimeout(function() {
      cb(new Error('jsonp request for ' + tmpName + ' timed out.'), null);
      clearTimer(timer);
    }, timeout);

    // create our temporary global function
    root[tmpName] = function(response) {
      cb(null, response);
      clearTimer(timer);
      root[tmpName] = null;
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
