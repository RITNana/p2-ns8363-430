/**
 * Middleware functiuons receive a request, response, and next middleware function to call
 * allows application to make variou decisions and potentially chain into the next function
 * request will NOT continue through the system unless you call the next function at the end
 */
// check if we attached an account to the session and redirection to home page
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

// check if user is already logged in and redirects them to app
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/main');
  }

  return next();
};

const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
