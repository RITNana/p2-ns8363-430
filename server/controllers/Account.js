const models = require('../models');

const { Account } = models;

// render in all of our pages
const loginPage = (req, res) => res.render('login');
// const aboutPage = (req, res) => res.render('about')

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/spotifyLogin' });
  });
};

// validate the data
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required! ' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // attempt to hash the password
  // send the user a direct message sending them to the maker page
  // if something goes wrong (11000 error code): tell user pword is taken
  // otherwise, send back a generic error message to the client
  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/main' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use! ' });
    }
    return res.status(500).json({ error: 'An error occured! ' });
  }
};

module.exports = {
  loginPage,
  // signupPage,
  login,
  logout,
  signup,
//  aboutPage
};
