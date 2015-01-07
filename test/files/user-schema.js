"use strict";

var Schema = require("mongoose").Schema;

module.exports = {
  name: String,
  login: { type: String, required: true },
  registeredBy: { type: Schema.ObjectId, ref: 'User', index: true }
};