const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const MusicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  artist: {
    type: String,
    required: true,
    trime: true,
  },

  album: {
    type: String,
    required: false,
    trim: true,
  },

  genre: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

});

MusicSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  artist: doc.artist,
  album: doc.album,
  genre: doc.genre,
});

const MusicModel = mongoose.model('Music', MusicSchema);
module.exports = MusicModel;
