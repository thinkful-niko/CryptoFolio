const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SnapshotSchema = new Schema({
     chartPoint: Array
     //date: String
});

module.exports = mongoose.model('Snapshot', SnapshotSchema);