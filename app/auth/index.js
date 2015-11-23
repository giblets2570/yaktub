var express = require('express');
var passport = require('passport');

var auth = require('./auth.service');

var router = express.Router();

// route to log in
router.get('/login', passport.authenticate('login'), function(req, res) {
	return res.redirect('/'+req.user.url_name+'/dashboard')
});

// route to log in
router.get('/signup', passport.authenticate('signup'), function(req, res) {
	return res.redirect('/'+req.user.url_name+'/dashboard')
});

// route to log out
router.get('/logout', function(req, res){
  req.logout();
  return res.redirect('/');
});

module.exports = router;