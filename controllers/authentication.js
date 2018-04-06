const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');


function tokenForUser(user) {
  const timestamp = new Date().getTime();

  // sub is convention; short for subject.
  // iat is another convention; short for issued at time.
  // config.secret is used to encrypt { sub: user.id, iat: timestamp }
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function (req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // see if a user with given email exists
  // User class not an instance. The entire
  // collection of users in the database
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) { return next(err); }

    // if a user with given email does exist, return error    
    if (existingUser) {
      // 422 is unproccesible entity - the supplied data (email here) is bad (already exists here).
      return res.status(422).send({ error: 'Email is in use' });
    }

    // if a user with given email does NOT exist,
    // create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function (err) {
      if (err) { return next(err); }

      // Respond to request indicating the user was created
      // res.json({ success: true });
      res.json({ token: tokenForUser(user) });

    });
  });

}