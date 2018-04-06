// in this file: local definition of what a user is
// we wiil tell this model to mongoose.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define model:
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true }, // String is Javascript String
  password: String
});

// On Save Hook, encrypt password
// Before saving the model run the callback function
userSchema.pre('save', function (next) {
  // get access to the user model.
  // 'this' here is an instance of the user model.
  // user.email and user.password are valid after
  // equating to 'this'.
  const user = this;

  // generate a salt and after some amount time generating
  // the salt run the callback function.
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }

    // hash (meaning encrypt) our password using the salt and then
    // run the callback function with the rsulting 
    // hash (or encrypted password)
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with the encrypted password.
      user.password = hash;

      // the pre save hook ended, now go ahead and save the user model.
      next();
    });
  });
});

// Create the model class for all users:
const ModelClass = mongoose.model('user', userSchema);

// Export the model:
module.exports = ModelClass;