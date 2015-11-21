// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user models
var Admin            = require('../api/admin/admin.model');

// expose this function to our app using module.exports
module.exports = function(passport) {

  //==================================================================
  // Define the strategy to be used by PassportJS
  passport.use('login', new LocalStrategy(
    function(username, password, done) {
      Admin.findOne({'name':username},function(err,admin){
        if(err){return done(null, false, { message: 'Error in request.' })}
        if(!admin){return done(null, false, { message: 'Incorrect username.' })}
        if(!admin.validPassword(password)){return done(null, false, { message: 'Incorrect password.' })}
        return done(null, admin);
      })
    }
  ));

  // Serialized and deserialized methods when got from session
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, admin) {
      if(admin){done(err, admin)}
    });
  });

};