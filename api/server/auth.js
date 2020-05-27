const { google } = require('googleapis');
const User = require('./models/User');
const slugify = require('slugify');
const jwt = require('jsonwebtoken');
const url = require('url');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_O_AUTH_CLIENT_ID,
  process.env.GOOGLE_O_AUTH_CLIENT_SECRET,
  'http://localhost:8000/api/v1/auth/o-auth-callback'
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

exports.googleLogin = (req, res, next) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      scope: scopes,
      prompt: 'consent',
    });
    res.redirect(url);
  } catch (err) {
    next(err);
  }
};

exports.callbackGoogle = async (req, res, next) => {
  try {
    // get the access token from the query string if successful
    const qs = new url.URL(req.url, 'http://localhost:8000').searchParams;
    const { tokens } = await oauth2Client.getToken(qs.get('code'));
    oauth2Client.setCredentials(tokens);
    const people = google.people('v1');

    // send the access token to the People API to access account information
    google.options({ auth: oauth2Client });
    let data = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names,photos',
    });
    data = data.data;

    const displayName = data.names[0].displayName;
    const email = data.emailAddresses[0].value;
    const avatarUrl = data.photos[0].url;

    let user = await User.findOne({ email }).lean();

    // search DB for this particular email
    if (user) {
      console.log('User founded with this email address');
      req.user = user;
    } else {
      console.log('No user founded');
      user = new User({
        displayName,
        email,
        avatarUrl,
        createdAt: Date.now(),
        slug: slugify(displayName),
      });
      await user.save();
      req.user = user;
    }

    next();
  } catch (err) {
    next(err);
  }
};

exports.generateJWTToken = async (req, res, next) => {
  console.log(req.user._id);
  const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET_KEY);
  res.cookie('async-chat-app', token, { httpOnly: true });
  res.send(token);
};

exports.logOut = async (req, res, next) => {
  console.log('log-out');
  console.log(req.cookies);
  res.clearCookie('async-chat-app');
  res.json({ done: 'done' });
};
