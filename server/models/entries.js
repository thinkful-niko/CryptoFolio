const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntrySchema = new Schema({
     id: String,
     name: String,
     symbol: String,
     price_usd: String,
     price_btc: String,
     percent_change_24h: String,
     last_updated: String,
     userId: String,
     amount: String
});

module.exports = mongoose.model('Entry', EntrySchema);