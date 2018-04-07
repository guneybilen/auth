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
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false.
  User.findOne({ email: email }, function (err, user) {
    if (err) { return done(err); }

    if (!user) { return done(null, false); }

    // Compare passwords - is the password entered
    // equal to the one in the database which is
    // user.password.
    // comparePassword is created in user.js:
    // userSchema.methods.comparePassword...
    user.comparePassword(password, function (err, isMatch) {
      if (err) { return done(err); }

      if (!isMatch) { return done(null, false); }

      return done(null, user);

    });
  })
});

// Setup options for JWT strategy
const jwtOptions = {
  // jwt token can be in the body, header or URL. We have to tell passport
  // where the token is located.
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),

  // our created secret key that is located in config.js
  secretOrKey: config.secret
};

// To authenticate a request for a secured resource,
// the token needs to be verified. This process uses the
// passport jwt strategy.
// We need to create a JWT strategy.
// payload parameter is the object with sub and iat in
// jwt.encode({ sub: user.id, iat: timestamp }
// which is located in 'function tokenForUser(user)' and which
// is located in in authentication.js file.
// A strategy in passport.js means to attempt to authenticate a user
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

// Tell passport to use these strategies.
passport.use(jwtLogin);
passport.use(localLogin);
