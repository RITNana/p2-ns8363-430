const controllers = require('./controllers');
const mid = require('./middleware');

// connect our routes to the page's configuration
const router = (app) => {
  app.get('/getSongs', mid.requiresLogin, controllers.Music.getSongs);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/reviewer', mid.requiresLogin, controllers.Music.makerPage);
  app.post('/reviewer', mid.requiresLogin, controllers.Music.makeMusic);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('/dislikes', mid.requiresLogin, controllers.Music.makerPage);
  app.get('/likes', mid.requiresLogin, controllers.Music.makerPage)
};

module.exports = router;
