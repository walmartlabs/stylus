
/*!
 * Stylus - plugin - url
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Compiler = require('../visitor/compiler')
  , nodes = require('../nodes')
  , parse = require('url').parse
  , path = require('path')
  , basename = path.basename
  , dirname = path.dirname
  , extname = path.extname
  , utils = require('../utils')
  , fs = require('fs');

/**
 * Mime table.
 */

var mimes = {
    '.gif': 'image/gif'
  , '.png': 'image/png'
  , '.jpg': 'image/jpeg'
  , '.jpeg': 'image/jpeg'
  , '.svg': 'image/svg+xml'
};

/**
 * Return a url() function with the given `options`.
 *
 * Options:
 *
 *    - `limit` bytesize limit defaulting to 30Kb
 *    - `paths` image resolution path(s), merged with general lookup paths
 *
 * Examples:
 *
 *    stylus(str)
 *      .set('filename', __dirname + '/css/test.styl')
 *      .define('url', stylus.url({ paths: [__dirname + '/public'] }))
 *      .render(function(err, css){ ... })
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

module.exports = function(options) {
  options = options || {};

  var sizeLimit = options.limit || 30000
    , _paths = options.paths || [];

  function url(url){
    // Compile the url
    var compiler = new Compiler(url);
    compiler.isURL = true;
    var url = url.nodes.map(function(node){
      return compiler.visit(node);
    }).join('');

    // Parse literal 
    var url = parse(url)
      , ext = extname(url.pathname)
      , mime = mimes[ext]
      , literal = new nodes.Literal('url("' + url.href + '")')
      , paths = _paths.concat(this.paths)
      , found
      , buf;

    // Not supported
    if (!mime) return literal;

    // Absolute
    if (url.protocol) return literal;

    // Lookup
    if (options.res) {
      var ext = extname(url.pathname)
        , highResFileName = '/' + basename(url.pathname, ext) + '@' + options.res + 'x' + ext
        , highResPath = dirname(url.pathname) + highResFileName;
      found = utils.lookup(highResPath, paths);

      if (found) {
        // Reset our literal path for the file too large case
        literal = new nodes.Literal('url("' + dirname(url.href) + highResFileName + '")')
      }
    }
    if (!found) {
      found = utils.lookup(url.pathname, paths);
    }

    // Failed to lookup
    if (!found) return literal;

    // Read data
    buf = fs.readFileSync(found);

    // To large
    if (buf.length > sizeLimit) return literal;

    // Encode
    return new nodes.Literal('url("data:' + mime + ';base64,' + buf.toString('base64') + '")');
  };

  url.raw = true;
  return url;
};