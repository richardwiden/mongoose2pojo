"use strict";

var mongoose = require("mongoose");
var JavaGenerator = require("./javaGenerator");
var path = require("path");

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

Converter.prototype.parseFile = function (fileName) {
  var fileContents;
  try {
    fileContents = require(path.resolve(process.cwd(), fileName));
  }
  catch (e) {
    throw new Error("Error reading file " + fileName + ". " + e)
  }
  return this.parse(fileContents);
};

function mongooseSchemaToPojo(options) {
  return new Converter(options || {});
}

module.exports = mongooseSchemaToPojo;
module.exports.Converter = Converter;
