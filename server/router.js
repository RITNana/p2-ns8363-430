const controllers = require('./controllers');
const mid = require('./middleware');

// connect our routes to the page's configuration
const router = (app) => {
  // ***ATTEMPTED path to get songs that are liked and disliked
  app.get('/getSongs', mid.requiresLogin, controllers.Music.getSongs);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // search and receive songs
  app.get('/main', mid.requiresLogin, controllers.Music.songPage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // Needed callbacks to log into the Spotify API
  // HINT: will need a Spotify Account tp access songs
  // callback gives the authorization code
  app.get('/spotifyLogin', mid.requiresLogin, controllers.Music.spotifyLogin);
  app.get('/callback', mid.requiresLogin, controllers.Music.spotifyCallBack);

  // search for tracks based on name, artist, or album
  app.get('/spotify/search', mid.requiresLogin, controllers.Music.searchSpotifyTracks);

  // ***ATTEMPTED path to go to preferences page and see liked and dislikes songs
  app.get('/preferences', mid.requiresLogin, controllers.Music.preferencePage);

  // ***ATTEMPTED path to view the Reviews Page
  app.get('/reviews', mid.requiresLogin, controllers.Review.reviewPage);
  app.post('/reviews', mid.requiresLogin, controllers.Review.makeReview);

  // ***ATTEMPTED path to get the reviews from the songs done
  app.get('/getReviews', mid.requiresLogin, controllers.Review.getReviews);

  // ***ATTEMPTED paths for editing and deleting a review
  app.put('/editReview/:id', mid.requiresLogin, controllers.Review.editReviews);
  app.delete('/deleteReview/:id', mid.requiresLogin, controllers.Review.deleteReviews);

  // Handle unknown pages
  app.use((req, res) => { res.status(404).render('404'); });
};

module.exports = router;
