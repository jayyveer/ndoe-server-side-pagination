// This code imports the Mongoose library 
// which is used to connect with MongoDB database and create object models of data

const mongoose = require("mongoose");

// This creates a schema that defines the structure for a user object.
// It includes one required field: name, which must be of type String.

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// This exports the created model to make it available in other parts of the application.

module.exports = mongoose.model("User", userSchema);
