'use strict';

var express = require('express');

var router = express.Router();
var config = require('../config/environment');
var auth = require('../auth/auth.service');
var url = require('url');

router.get('/setup', function(req, res){
	return res.render(config.root + '/public/views/setup');
});

router.get('/admin', function(req, res){
	return res.render(config.root + '/public/views/login');
});

router.get('/admin/dashboard', auth.isAuthenticated(), function(req, res){
	return res.render(config.root + '/public/views/admin');
});

router.get('/interview', function(req, res){
	return res.render(config.root + '/public/views/interview');
});

router.get('/thankyou', function(req, res){
	return res.render(config.root + '/public/views/thankyou');
});

module.exports = router;