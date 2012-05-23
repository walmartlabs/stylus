
/*!
 * Stylus - Arguments
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node')
  , nodes = require('../nodes')
  , utils = require('../utils');

/**
 * Initialize a new `Arguments`.
 *
 * @api public
 */

var Arguments = module.exports = function Arguments(){
  nodes.Expression.call(this);
  this.map = {};
};

/**
 * Inherit from `nodes.Expression.prototype`.
 */

Arguments.prototype.__proto__ = nodes.Expression.prototype;

/**
 * Initialize an `Arguments` object with the nodes
 * from the given `expr`.
 *
 * @param {Expression} expr
 * @return {Arguments}
 * @api public
 */

Arguments.fromExpression = function(expr){
  var args = new Arguments;
  args.lineno = expr.lineno;
  args.isList = expr.isList;
  args.nodes = expr.nodes.slice(0);
  return args;
};

/**
 * Return a clone of this node.
 *
 * @return {Node}
 * @api public
 */

Arguments.prototype.clone = function(){
  var clone = nodes.Expression.prototype.clone.call(this);
  clone.map = this.map;
  return clone;
};

