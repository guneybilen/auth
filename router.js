
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');


// we are using jason web token (jwt) strategy in this app.
// So, we ask passport to authenticate with jwt strategy.
// passport will try create a cookie based session and since
// we are using jwt's and not cookies, we need to indicate { session: false }.
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function (app) {

  // if you want to secure a resource behind a valid user
  // in the future follow this route
  // app.get('/', requireAuth, function (req, res) {
  //   ANYTHING YOU WANT TO SECURE
  // })

  app.get('/', requireAuth, function (req, res) {
    res.send({ hi: 'there' });
  })

  // run the middleware requireSignin and if passes,
  // only then you can go to Authentication.signin.
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}