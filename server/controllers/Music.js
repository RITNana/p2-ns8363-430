// Declare SpotifyWebAPI function node
// Declare models variable for server side configuration for Music.js

const SpotifyWebAPI = require('spotify-web-api-node');
const models = require('../models');

const { Music } = models;

// requires clientId, client secret and redirect uro
const spotifyApi = new SpotifyWebAPI({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

// render in our song and preference pages
const songPage = async (req, res) => res.render('app');

const preferencePage = async (req, res) => res.render('preferences');

// ATTEMPT
// Get the songs that are liked and disliked by user
const getSongs = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };

    // Check if 'status' parameter is provided in the request
    if (req.query.status) {
      if (req.query.status === 'liked') {
        query.liked = true;
      } else if (req.query.status === 'disliked') {
        query.disliked = true;
      }
    }
    const docs = await Music.find(query);
    return res.json({ songs: docs }); // return the received data for docs
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Error retrieving songs!' });
  }
};

// create function for Spotify Authorization Log In
const spotifyLogin = (req, res) => {
  const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state'];
  return res.redirect(spotifyApi.createAuthorizeURL(scopes));
};

// Callback function to confirm successful authorization
// Code Source: https://www.youtube.com/watch?v=TN1uvgAyxE0
const spotifyCallBack = async (req, res) => {
  const { error } = req.query;
  const { code } = req.query;

  if (error) {
    console.log('Error!', error);
    return res.status(400).json(`Error: ${error}`);
  }

  try {
    console.log(`Authorization code received: ${code}`);

    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body.access_token;
    const refreshToken = data.body.refresh_token;
    const expiresIn = data.body.expires_in;

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    console.log(`Access Token: ${accessToken}, \n Refresh Token: ${refreshToken}`);

    // Redirect to the main page after setting tokens
    res.redirect('/main');

    // Refresh the access token periodically
    setInterval(async () => {
      const refreshData = await spotifyApi.refreshAccessToken();
      const accessTokenRefreshed = refreshData.body.access_token;
      spotifyApi.setAccessToken(accessTokenRefreshed);
    }, (expiresIn / 2) * 1000);
  } catch (err) {
    console.log('Error', err);
    // Send error response if there's an issue getting tokens
    return res.status(400).json({ error: 'Error getting tokens!' });
  }
  return console.log('done');
};

// search the Spotify API for tracks based on title, artist, or album
// utilize the searchTracks propety passing in our query params
const searchSpotifyTracks = async (req, res) => {
  const {
    title, artist, album, genre,
  } = req.query;
  let q = '';
  if (title) q += `track:${title} `;
  if (artist) q += `artist:${artist} `;
  if (album) q += `album:${album} `;
  if (genre) q += `genre${genre}`;

  q = q.trim();

  try {
    const searchData = await spotifyApi.searchTracks(q);
    const tracks = searchData.body.tracks.items.map((item) => ({
      title: item.name,
      artist: item.artists.map((a) => a.name).join(' , '),
      album: item.album.name,
      genre: '',
      spotifyId: item.id,
      coverArt: item.album.images[0].url || ' ',
    }));

    // add the tracks found to a new documents in our Music model
    const savedTracksPromises = tracks.map(async (track) => {
      const existingTrack = await Music.findOne({ spotifyId: track.spotifyId });
      if (!existingTrack) {
        const newTrack = new Music({ ...track, owner: req.session.account._id });
        await newTrack.save();
        return newTrack;
      }
      return existingTrack;
    });

    const savedTracks = await Promise.all(savedTracksPromises);
    return res.json({ savedTracks });
  } catch (err) {
    return res.status(400).json({ error: `Error searching Spotify ${err}` });
  }
};

// export our functions
module.exports = {
  songPage,
  preferencePage,
  getSongs,
  spotifyCallBack,
  spotifyLogin,
  searchSpotifyTracks,
};
