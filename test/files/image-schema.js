"use strict";

var Schema = require("mongoose").Schema;

module.exports = new Schema({
  ref:  { type: Schema.ObjectId, ref: 'Asset', index: true },
  time: { type: Date, index: true },
  type: String
}, { collection: 'myimage' });