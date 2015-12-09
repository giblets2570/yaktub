// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user models
var Client            = require('../api/client/client.model');

// expose this function to our app using module.exports
module.exports = function(passport) {

  //==================================================================
  // Define the strategy to be used by PassportJS
  passport.use('login', new LocalStrategy(
    function(username, password, done) {
      Client.findOne({'name':username},function(err,client){
        if(err){return done(null, false, { message: 'Error in request.' })}
        if(!client){
          Client.findOne({'email':username},function(err,client){
            if(err){return done(null, false, { message: 'Error in request.' })}
            if(!client) return done(null, false, { message: 'Incorrect username.' })
            if(!client.validPassword(password)){return done(null, false, { message: 'Incorrect password.' })}
            return done(null, client);
          })
        }else{
          if(!client.validPassword(password)){return done(null, false, { message: 'Incorrect password.' })}
          return done(null, client);
        }
      })
    }
  ));

  passport.use('signup', new LocalStrategy(
    function(username, password, done) {
      Client.findOne({'email':username.email},function(err,client){
        if(err){return done(null, false, { message: 'Error in request.' })}
        if(client){return done(null, false, { message: 'Email already in use!' })}
        Client.findOne({'name': username.name}, function(err, client){
          if(err){return done(null, false, { message: 'Error in request.' })}
          if(client){return done(null, false, { message: 'Name already in use!' })}
          var client = new Client();
          client.name = username.name;
          client.company_name = username.company_name;
          client.email = username.email;
          client.url_name = client.urlSafeName(username);
          client.password = client.generateHash(password);
          client.save(function(err){
            if(err){return done(null, false, { message: 'Error in request.' })}
            return done(null, client);
          })
        })
      })
    }
  ));

  // Serialized and deserialized methods when got from session
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    Client.findById(id, function(err, client) {
      if(client){done(err, client)}
    });
  });

};