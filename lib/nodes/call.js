
/*!
 * Stylus - Call
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node')
  , inspect = require('util').inspect;

/**
 * Initialize a new `Call` with `name` and `args`.
 *
 * @param {String} name
 * @param {Expression} args
 * @api public
 */

var Call = module.exports = function Call(name, args){
  Node.call(this);
  this.name = name;
  this.args = args;
};

/**
 * Inherit from `Node.prototype`.
 */

Call.prototype.__proto__ = Node.prototype;

/**
 * Return a clone of this node.
 * 
 * @return {Node}
 * @api public
 */

Call.prototype.clone = function(parent){
  var clone = new Call(this.name);
  clone.args = this.args.clone(parent, clone);
  clone.lineno = this.lineno;
  clone.filename = this.filename;
  return clone;
};

/**
 * Return <name>().
 *
 * @return {String}
 * @api public
 */

Call.prototype.toString = function(){
  return this.name + '()';
};

/**
 * Custom inspect.
 *
 * @return {String}
 * @api public
 */

Call.prototype.inspect = function(){
  return '[Call ' + this.name + ' ' + inspect(this.args) + ']';
};
