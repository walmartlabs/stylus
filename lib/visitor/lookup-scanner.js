
/*!
 * Stylus - LookupScanner
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Visitor = require('./')
  , nodes = require('../nodes');

/**
 * Initialize a new `LookupScanner` with the given `root` Node
 * and the following `options`.
 *
 * Scans a given AST looking for nodes that have not been fully
 * resolved.
 *
 * @api private
 */

var LookupScanner = module.exports = function LookupScanner() {
  Visitor.call(this);
};

/**
 * Inherit from `Visitor.prototype`.
 */

LookupScanner.prototype.__proto__ = Visitor.prototype;

/**
 * Proxy visit to expose node line numbers.
 *
 * @param {Node} node
 * @return {Node}
 * @api private
 */

var visit = Visitor.prototype.visit;
LookupScanner.prototype.visit = function(node){
  // Allow unimplemented methods by making true non-truthy.
  return visit.call(this, node) === true;
};

/**
 * Visit Group.
 */

LookupScanner.prototype.visitGroup = function(group){
  var nodes = group.nodes
    , len = nodes.length;
  for (var i = 0; i < len; ++i) {
    if (this.visit(nodes[i])) {
      return true;
    }
  }

  return this.visit(group.block);
};

/**
 * Visit Return.
 */

LookupScanner.prototype.visitReturn = function(ret){
  return this.visit(ret.expr);
};

/**
 * Visit Media.
 */

LookupScanner.prototype.visitMedia = function(media){
  return this.visit(media.block);
};

/**
 * Visit FontFace.
 */

LookupScanner.prototype.visitFontFace = LookupScanner.prototype.visitMedia;

/**
 * Visit FontFace.
 */

LookupScanner.prototype.visitPage = LookupScanner.prototype.visitMedia;

/**
 * Visit Keyframes.
 */

LookupScanner.prototype.visitKeyframes = function(keyframes){
  if (this.visit(keyframes.name)) {
    return true;
  }

  var nodes = keyframes.frames
    , len = nodes.length;
  for (var i = 0; i < len; ++i) {
    if (this.visit(nodes[i])) {
      return true;
    }
  }

  return false;
};

/**
 * Visit Each.
 */

LookupScanner.prototype.visitEach = function(each){
  return this.visit(each.expr) || this.visit(each.block);
};

/**
 * Visit Call.
 */

LookupScanner.prototype.visitCall = function(call){
  return true;
};

/**
 * Visit Ident.
 */

LookupScanner.prototype.visitIdent = function(ident){
  return ident.val.isNull;
};

/**
 * Visit BinOp.
 */

LookupScanner.prototype.visitBinOp = function(binop){
  return this.visit(binop.left) || this.visit(binop.right) || this.visit(binop.val);
};

/**
 * Visit UnaryOp.
 */

LookupScanner.prototype.visitUnaryOp = function(unary){
  return this.visit(unary.expr);
};

/**
 * Visit TernaryOp.
 */

LookupScanner.prototype.visitTernary = function(ternary){
  return this.visit(ternary.cond) || this.visit(ternary.trueExpr) || this.visit(ternary.falseExpr);
};

/**
 * Visit Expression.
 */

LookupScanner.prototype.visitExpression = function(expr){
  for (var i = 0, len = expr.nodes.length; i < len; ++i) {
    if (this.visit(expr.nodes[i])) {
      return true;
    }
  }

  return false;
};

/**
 * Visit Arguments.
 */

LookupScanner.prototype.visitArguments = LookupScanner.prototype.visitExpression;

/**
 * Visit Property.
 */

LookupScanner.prototype.visitProperty = function(prop){
  return this.visit(prop.expr);
};

/**
 * Visit Root.
 */

LookupScanner.prototype.visitRoot = function(block){
  var nodes = block.nodes
    , len = nodes.length;
  for (var i = 0; i < len; ++i) {
    if (this.visit(nodes[i])) {
      return true;
    }
  }
  return block;
};

/**
 * Visit Block.
 */

LookupScanner.prototype.visitBlock = LookupScanner.prototype.visitRoot;

/**
 * Visit If.
 */

LookupScanner.prototype.visitIf = function(node){
  if (this.visit(node.cond) || this.visit(node.block)) {
    return true;
  }

  var elses = node.elses
    , len = elses.length;
  for (var i = 0; i < len; ++i) {
    if (this.visit(elses[i])) {
      return true;
    }
  }

  return false;
};

/**
 * Visit Import.
 */

LookupScanner.prototype.visitImport = function(imported){
  return this.visit(imported.path);
};
