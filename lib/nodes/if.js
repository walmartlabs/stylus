
/*!
 * Stylus - If
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node');

/**
 * Initialize a new `If` with the given `cond`.
 *
 * @param {Expression} cond
 * @param {Boolean|Block} negate, block
 * @api public
 */

var If = module.exports = function If(cond, negate){
  Node.call(this);
  this.cond = cond;
  this.elses = [];
  if (negate && negate.nodeName) {
    this.block = negate;
  } else {
    this.negate = negate;
  }
};

/**
 * Inherit from `Node.prototype`.
 */

If.prototype.__proto__ = Node.prototype;

/**
 * Return a clone of this node.
 * 
 * @return {Node}
 * @api public
 */

If.prototype.clone = function(parent){
  var clone = new If();
  clone.cond = this.cond.clone(parent, clone);
  clone.block = this.block.clone(parent, clone);
  clone.elses = this.elses.map(function(node){ return node.clone(parent, clone); });
  clone.negate = this.negate;
  clone.postfix = this.postfix;
  clone.lineno = this.lineno;
  clone.filename = this.filename;
  return clone;
};
