const models = require('../models');

const { Music } = models;

const makerPage = async (req, res) => res.render('app');

const makeMusic = async (req, res) => {
  if (!req.body.title || !req.body.artist || !req.body.genre) {
    return res.status(400).json({ error: 'title, artist, and genre are required' });
  }

  const musicData = {
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
    genre: req.body.genre,
    owner: req.session.account._id,
  };

  try {
    const newMusic = new Music(musicData);
    await newMusic.save();
    return res.status(201).json({
      title: newMusic.title, artist: newMusic.artist, album: newMusic.album, genre: newMusic.genre,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Music review already exists' });
    }
    return res.status(500).json({ error: ' an error occured making review!' });
  }
};

const getSongs = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Music.find(query);

    return res.json({ songs: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving songs!' });
  }
};

module.exports = {
  makerPage,
  makeMusic,
  getSongs,
};
