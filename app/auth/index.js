var express = require('express');
var passport = require('passport');

var auth = require('./auth.service');

var router = express.Router();

// route to log in
router.post('/login', passport.authenticate('login'), function(req, res) {
	return res.status(200).json(req.user);
});

router.get('/loggedin', function(req, res){
	return res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
router.get('/signup', passport.authenticate('signup'), function(req, res) {
	return res.redirect('/dashboard')
});

// route to log out
router.get('/logout', function(req, res){
  req.logout();
  return res.redirect('/');
});

module.exports = router;