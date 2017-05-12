const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ContestSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	prediction: Number,
	date: { type: String},
  score: Number
});

module.exports = mongoose.model('Contest', ContestSchema);

