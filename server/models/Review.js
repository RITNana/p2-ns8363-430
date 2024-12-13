const mongoose = require('mongoose');
// const _ = require("underscore");

// const setName = (name) => _.escape(name).trim();

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },

  song: {
    type: mongoose.Schema.ObjectId,
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
  user: doc.user,
  song: doc.song,
  reviewText: doc.reviewText,
  rating: doc.rating,
  createdAt: doc.createdAt,

});

const ReviewModel = mongoose.model('Review', ReviewSchema);
module.exports = ReviewModel;
