const SpotifyWebAPI = require('spotify-web-api-node');
const models = require('../models');

const { Music } = models;

const spotifyApi = new SpotifyWebAPI({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

const songPage = async (req, res) => res.render('app');

const preferencePage = async(req, res) => res.render('preferences')

// const searchLocalMusic = async (req, res) => {
//   const title = req.query.title;
//   const artist = req.query.artist;
//   const album = req.query.album;
//   const game = req.query.game;

//   if(title) query.title = { $regex: title, $options: 'i' }
//   if (artist) query.artist = { $regex: artist, $options: 'i'}
//   if (album) query.album = { $regex: album, $options: 'i'}
//   if (game) query.game = { $regex: game, $options: 'i'}

//   try{
//     const songs = await Music.find(query)
//     res.json({ songs });

//   } catch(err){
//     return res.status(500).json({ error: 'Error getting songs'})
//   }
// }

// const makeMusic = async (req, res) => {
//   if (!req.body.title || !req.body.artist || !req.body.genre) {
//     return res.status(500).json({ error: 'title, artist, and genre are required' });
//   }

//   const musicData = {
//     title: req.body.title,
//     artist: req.body.artist,
//     album: req.body.album,
//     genre: req.body.genre,
//     owner: req.session.account._id,
//   };

//   try {
//     const newMusic = new Music(musicData);
//     await newMusic.save();
//     return res.status(201).json({
//       title: newMusic.title, 
// artist: newMusic.artist, 
// album: newMusic.album, 
// genre: newMusic.genre,
//     });
//   } catch (err) {
//     console.log(err);
//     if (err.code === 11000) {
//       return res.status(500).json({ error: 'Music review already exists' });
//     }
//     return res.status(500).json({ error: ' an error occured making review!' });
//   }
// }

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

const spotifyLogin = async (req, res) => {
  const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state'];
  return res.redirect(spotifyApi.createAuthorizeURL(scopes));
};

const spotifyCallBack = async (req, res) => {
  const { error } = req.query;
  const { code } = req.query;

  if (error) {
    console.log('Error!', error);
    return res.status(500).json(`Error: ${error}`);
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
    res.redirect('/main');

    setInterval(async () => {
      const data = await spotifyApi.refreshAccessToken();
      const accessTokenRefreshed = data.body.access_token;
      spotifyApi.setAccessToken(accessTokenRefreshed);
    }, (expiresIn / 2) * 1000);
  } catch (err) {
    console.log('Error', error);
    return res.status(500).json({ error: 'Error getting tokens!' });
  }
};

const searchSpotifyTracks = async (req, res) => {
  const {
    title, artist, album, genre,
  } = req.query;
  let q = '';
  if (title) q += `track:${title}`;
  if (artist) q += `artist:${artist}`;
  if (album) q += `album:${album}`;
  if (genre) q += `genre:${genre}`;
  try {
    const searchData = await spotifyApi.searchTracks(q.trim());
    console.log("spotify search data", searchData.body)
    const tracks = searchData.body.tracks.items.map((item) => ({
      title: item.name,
      artist: item.artists.map((artist) => artist.name).join(' , '),
      album: item.album.name,
      genre: '',
      spotifyId: item.id,
      coverArt: item.album.images[0].url || ' ',
    }));

    const savedTracks = [];
    for (const track of tracks) {
      const existingTrack = await Music.findOne({ spotifyId: track.spotifyId });
      if (!existingTrack) {
        const newTrack = new Music({ ...track, owner: req.session.account._id });
        await newTrack.save();
        savedTracks.push(newTrack);
      } else {
        savedTracks.push(existingTrack);
      }
    }
    res.json({ savedTracks });
  } catch (err) {
    return res.status(500).json({ error: `Error searching Spotify ${err}` });
  }
};

const playTrack = async (req, res) => {
  const { uri } = req.query;
  try {
    await spotifyApi.play({ uris: [uri] });
    res.send('playback started');
  } catch (err) {
    return res.status(500).json({ error: `Error playing ${err}` });
  }
};

module.exports = {
  songPage,
  preferencePage,
  getSongs,
  spotifyCallBack,
  spotifyLogin,
  searchSpotifyTracks,
  playTrack,
};
