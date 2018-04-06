const passport = require('passport')
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// create local strategy
// Local strategy by defaul uses username
// we have to tell passport that for the username field
// look at the email property of the request.
// password is handled automatically by password
// there is no seperate configuration required.
// After the LocalStrategy parses the request, it pulls out
// email and password and hands in to
// the callback email and password
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy({}, function (email, password, done) {
  // Verify this username and password, call done with the user
  // if it is the correct username and password
  // otherwise, call done with false.

});

// Setup options for JWT strategy
const jwtOptions = {
  // jwt token can be in the body, header or URL. We have to tell passport
  // where the token is located.
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),

  // our created secret key that is located in config.js
  secretOrKey: config.secret
};

// Create JWT strategy
// payload parameter is the object with sub and iat in
// jwt.encode({ sub: user.id, iat: timestamp }
// which is located in function tokenForUser(user) and which
// is located in in authentication.js file.
// strategy in passport.js is attempt to authenticate a user
// in a very particular fashion.
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // otherwise, call done without a user object.
  User.findById(payload.sub, function (err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user); // found user and no error so pass null for error
    } else {
      done(null, false); // no user found and there is no error so pass null for error
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);