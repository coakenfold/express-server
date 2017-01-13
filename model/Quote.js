const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quoteSchema = new Schema({
  name: String,
  quote: String
});

var Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;