const mongoose = require('mongoose');
const { Schema } = mongoose;
// const Schema = mongoose.Schema; //ESLint Destructuring Required

// CREATE SCHEMA
const UserSchema = new Schema({
  googleID: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  image: {
    type: String,
  },
});

// CREATE COLLECTION & ADD SCHEMA
mongoose.model('users', UserSchema);
