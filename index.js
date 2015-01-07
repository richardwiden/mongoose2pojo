"use strict";

var mongoose = require("mongoose");
var JavaGenerator = require("./java-generator");
var path = require("path");
var _s = require("underscore.string");
var fs = require('fs');

function Converter(options) {
  this.options = options || {};
  this.generator = this.options.generator || new JavaGenerator(this.options);
}

Converter.prototype.parse = function (schemaOrDefinition) {
  var schema;
  if (schemaOrDefinition.constructor && schemaOrDefinition.constructor.name === "Schema") {
    schema = schemaOrDefinition;
  } else {
    schema = new mongoose.Schema(schemaOrDefinition);
  }

  return this.parseSchema(schema);
};

Converter.prototype.parseSchema = function (schema) {
  this.options.className = _s.classify(
    this.options.className ||
    schema.options.collection ||
    Converter.getClassNameFromFileName(this._fileName) ||
    "ClassName"
  );

  schema.eachPath(function (key, schemaString) {
    this.generator.generateProperty(key, schemaString);
  }.bind(this));

  return this.generator.value();
};

function replaceAll(str, find, replace, ignorecase) {
  var flags = (ignorecase === true) ? "gi" : "g";
  var reg = new RegExp(find, flags);

  return str.replace(reg, replace);
}

Converter.getClassNameFromFileName = function (fileName) {
  if (!fileName) {
    return undefined;
  }

  fileName = path.basename(fileName);
  fileName = fileName.split(".")[0];
  fileName = replaceAll(fileName, "schema", "", true);
  fileName = _s.classify(fileName);
  return fileName;
};

Converter.prototype.parseFile = function (fileName) {
  this._fileName = fileName;
  var fileContents;
  try {
    fileContents = require(path.resolve(process.cwd(), this._fileName));
  }
  catch (e) {
    throw new Error("Error reading file " + this._fileName + ". " + e.stack)
  }

  return this.parse(fileContents);
};

Converter.convertFile = function (fileName) {
  var converter = new Converter();
  var fullFileName = path.resolve(process.cwd(), fileName);
  var newFileContents = converter.parseFile(fullFileName);

  var dir = path.dirname(fullFileName);
  var newFileName = converter.options.className + "Pojo.java";
  var newFullFileName = path.join(dir, newFileName);

  fs.writeFileSync(newFullFileName, newFileContents);
  return {
    name: newFullFileName,
    content: newFileContents
  };
};

function mongooseSchemaToPojo(options) {
  return new Converter(options || {});
}

module.exports = mongooseSchemaToPojo;
module.exports.Converter = Converter;
module.exports.convertFile = Converter.convertFile;
