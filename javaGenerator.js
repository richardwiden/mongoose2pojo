"use strict";

var _ = require("lodash");
_.mixin(require("underscore.string").exports());
var util = require("util");

function JavaGenerator(options) {
  this.options = options;
  this.header = "";
  this.footer = "";
  this.variables = "";
  this.gettersSetters = "";
}

JavaGenerator.prototype._appendline = function(line) {
  var args = Array.prototype.slice.call(arguments, 1);

  args.unshift(line + "\n");
  return util.format.apply(undefined, args);
};

JavaGenerator.prototype._convertType = function (schemaType) {

  var jsType, isArray = false;
  if (schemaType.instance) {
    jsType = schemaType.instance;
  } else if (schemaType.options.type.name) {
    jsType = schemaType.options.type.name;
  } else if (Array.isArray(schemaType.options.type)) {
    isArray = true;
    jsType = schemaType.options.type[0].name;
  } else if (schemaType.constructor.name) {
    jsType = schemaType.constructor.name;
  }

  var javaType = {
    String: "String",
    Date: "Date",
    Boolean: "boolean",
    Number: "double",
    Buffer: "byte[]",
    Mixed: "Map<String, Object>",
    ObjectID: "UUID",
    ObjectId: "UUID"
  }[jsType];

  if (isArray) {
    javaType += "[]";
  }

  if (!javaType) {
    throw new Error("Unable to convert to JAVA type: " + JSON.stringify(schemaType));
  }

  return javaType;
};

JavaGenerator.prototype.generateProperty = function (key, schemaType) {
  var varName = _(key).trim("_").camelize().value();
  var varType = this._convertType(schemaType);

  this.variables += this._appendline("private %s %s;", varType, varName);

  this.gettersSetters += this._appendline("public %s get%s(){", varType, _.capitalize(varName));
  this.gettersSetters += this._appendline("return this.%s;", varName);
  this.gettersSetters += this._appendline("}");

  this.gettersSetters += this._appendline("public void set%s(%s %s){", _.capitalize(varName), varType, varName);
  this.gettersSetters += this._appendline("this.%s = %s;", varName, varName);
  this.gettersSetters += this._appendline("}");
};

JavaGenerator.prototype._generateHeader = function () {
  this.header = this._appendline("public class %s{", this.options.className || "ClassName");
};

JavaGenerator.prototype._generateFooter = function () {
  this.footer = this._appendline("}");
};

JavaGenerator.prototype.value = function () {
  if (!this.footer) {
    this._generateFooter();
  }

  if (!this.header) {
    this._generateHeader();
  }

  return JavaGenerator.beautify(this.header + this.variables + "\n" + this.gettersSetters + this.footer);
};

JavaGenerator.beautify = function (s) {
  var ident = 0;

  // Remove empty lines at the end of the file.
  s = s.split("\n");
  while (!s[s.length - 1]) {
    s.pop();
  }

  return _.reduce(s, function (full, line) {
    if (line[line.length - 1] === "}") {
      ident--;
    }
    var newLine = full + _.repeat("\t", ident) + line + "\n";
    if (line[line.length - 1] === "{") {
      ident++;
    }

    return newLine;
  }, "");
};


module.exports = JavaGenerator;