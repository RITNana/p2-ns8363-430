const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const MusicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true,
    set: setName,
  },
  artist: {
    type: String,
    required: false,
    trim: true,
  },

  album: {
    type: String,
    required: false,
    trim: true,
  },

  genre: {
    type: String,
    required: false,
    trim: true,
  },

  spotifyId: {
    type: String,
    unique: true,
  },

  coverArt: {
    type: String,
    default: '',
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
  spotifyId: doc.spotifyId,
  coverArt: doc.coverArt,
});

const MusicModel = mongoose.model('Music', MusicSchema);
module.exports = MusicModel;
