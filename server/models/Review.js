const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

// Our Review Schema

const ReviewSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
    required: true,
    set: setName,
  },

  song: {
    type: String,
    ref: 'Song',
    required: true,
  },

  reviewText: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReviewSchema.statics.toAPI = (doc) => ({
  song: doc.song,
  reviewText: doc.reviewText,
  rating: doc.rating,
  // createdAt: doc.createdAt,

});

const ReviewModel = mongoose.model('Review', ReviewSchema);
module.exports = ReviewModel;
