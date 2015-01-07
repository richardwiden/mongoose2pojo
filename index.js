"use strict";

var mongoose = require("mongoose");
var JavaGenerator = require("./javaGenerator");
var path = require("path");
var _s = require("underscore.string");

function Converter(options) {
  this.options = options;
  this.generator = options.generator || new JavaGenerator(options);
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
  this.generator.generateHeader(schema);

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
  fileName = path.basename(fileName);
  fileName = fileName.split(".")[0];
  fileName = replaceAll(fileName, "schema", "", true);
  fileName = _s.classify(fileName);
  return fileName;
};

Converter.prototype.parseFile = function (fileName) {
  var fileContents;
  try {
    fileContents = require(path.resolve(process.cwd(), fileName));
    this.options.className = Converter.getClassNameFromFileName(fileName);
  }
  catch (e) {
    throw new Error("Error reading file " + fileName + ". " + e.stack)
  }
  return this.parse(fileContents);
};

function mongooseSchemaToPojo(options) {
  return new Converter(options || {});
}

module.exports = mongooseSchemaToPojo;
module.exports.Converter = Converter;
