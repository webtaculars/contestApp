const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SensexValueSchema = new Schema({
  date: { type: String},
  value: Number
});

module.exports = mongoose.model('SensexValue', SensexValueSchema);

