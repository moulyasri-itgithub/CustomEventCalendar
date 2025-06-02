const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: { type: String, unique: true },  // string ID like E1001
  name: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  datetime: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
