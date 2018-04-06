
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');


// we are using jason web token (jwt) strategy in this app.
// So, we ask passport to authenticate with jwt strategy.
// passport will try create a cookie based session and since
// we are using jwt's and not cookies we need to indicate session: false.
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  app.get('/', requireAuth, function (req, res) {
    res.send({ hi: 'there' });
  })

  app.post('/signup', Authentication.signup);
}