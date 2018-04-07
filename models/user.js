// in this file: local definition of what a user is
// we wiil tell this model to mongoose.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define the model:
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true }, // String is Javascript String
  password: String
});

// On Save Hook, encrypt password
// Before saving the model run the callback function
userSchema.pre('save', function (next) {
  // here we get access to the user model.
  // 'this' here is: an instance of the user model.
  // user.email and user.password are valid after
  // equating to 'this'.
  const user = this;

  // generate a salt and after some amount of time 
  // generating the salt run the callback function.
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }

    // hash (meaning encrypt) our password using the salt and then
    // run the callback function with the resulting 
    // hash (or encrypted) password.
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with the encrypted password.
      user.password = hash;

      // the pre save hook ended, now go ahead and save the user model.
      next();
    });
  });
});

// the instance method comparePassword is being created
// comparePassword method is used when signing in the app.
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  // this.password is the one in DB, the already hashed and salted password.

  // .compare method will use the same salt when creating the initial password. 
  // (I guess...) bcrypt pulls of the salt from the hash located in the DB as password
  // .compare method will encrypt the user submitted password with this pulled off 
  // salt and produce a new hashed passowrd and compare to see if the newly created
  // (salted and encrypted) password is the same as with the db stored password.
  // .compare method DOES NOT DO decrytpion for the DB stored password. 
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create the model class for all users:
const ModelClass = mongoose.model('user', userSchema);

// Export the model:
module.exports = ModelClass;