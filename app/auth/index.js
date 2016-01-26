var express = require('express');
var passport = require('passport');
var Keen = require('keen-js');
var Client = require('../api/client/client.model')
var auth = require('./auth.service');
var keenDetails = require('../config/keen');
var keen = new Keen({
  projectId: keenDetails.projectId,
  writeKey: keenDetails.writeKey,
  readKey: keenDetails.readKey
});

var router = express.Router();

// route to log in
router.post('/login', passport.authenticate('login'), function(req, res) {
  console.log(keen);
  var loginEvent = {
    user: {
      name: req.user.name,
      _id: req.user._id
    },
    keen: {
      timestamp: new Date().toISOString()
    }
  };
  keen.addEvent("logins", loginEvent, function(err, response){
    if (err) {console.log(err)};
    console.log(response);
  });
  return res.status(200).json(req.user);
});

router.get('/loggedin', function(req, res){
	return res.send(req.isAuthenticated() ? req.user : '0');
});

// route to signup
router.post('/signup', function(req, res) {
	Client.findOne({'email':req.body.username.email},function(err,client){
    if(err){return res.status(401).json({ message: 'Error in request.' })}
    if(client){return res.status(401).json({ message: 'Email already in use!' })}
    Client.findOne({'name': req.body.username.name}, function(err, client){
      if(err){return res.status(401).json({ message: 'Error in request.' })}
      if(client){return res.status(401).json({ message: 'Name already in use!' })}
      var client = new Client();
      client.name = req.body.username.name;
      client.company_name = req.body.username.company_name;
      client.email = req.body.username.email;
      client.url_name = client.urlSafeName(req.body.username.name);
      client.password = client.generateHash(req.body.password);
      client.save(function(err){
        if(err){return res.status(401).json({ message: 'Error in request.' })}
        // Bit of a hack :P
        req.body.username = req.body.username.name;
        passport.authenticate('login')(req,res,function(){
          var signupEvent = {
            user: {
              name: req.user.name,
              _id: req.user._id,
            },
            keen: {
              timestamp: new Date().toISOString()
            }
          };
          keen.addEvent("signups", signupEvent, function(err, response){
            if (err) {console.log(err)};
            console.log(response);
          });
          return res.status(201).json(req.user);
        })
      })
    })
  })
});

// route to log out
router.get('/logout', function(req, res){
  req.logout();
  return res.redirect('/');
});

module.exports = router;