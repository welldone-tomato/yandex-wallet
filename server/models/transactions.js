const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
});

module.exports = mongoose.model('transaction', transactionSchema);
