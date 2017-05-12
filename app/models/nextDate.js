const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NextDateSchema = new Schema({
  nextDate: { type: String},
});

module.exports = mongoose.model('NextDate', NextDateSchema);

