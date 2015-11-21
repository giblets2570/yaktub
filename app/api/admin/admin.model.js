// app/models/nerd.js
// grab the mongoose module
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var adminSchema = mongoose.Schema({
  name : {type : String, default: ''},
  password: {type : String, default: ''},
  created: {
    type: Date,
    default: new Date()
  }
});

// methods ======================
// generating a hash
adminSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);