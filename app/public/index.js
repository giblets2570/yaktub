'use strict';

var express = require('express');

var router = express.Router();
var config = require('../config/environment');
var auth = require('../auth/auth.service');
var url = require('url');

var Campaign = require('../api/campaign/campaign.model')
var Client = require('../api/client/client.model')

router.get('/login', function(req, res){
	return res.render(config.root + '/public/views/login');
});

router.get('/signup', function(req, res){
	return res.render(config.root + '/public/views/signup');
});

router.get('/dashboard', auth.isAuthenticated(), function(req, res){
	return res.render(config.root + '/public/views/dashboard', {name: req.user.name});
});

router.get('/dashboard/:campaign_name', auth.isAuthenticated(), function(req, res){
	Campaign.findOne({client: req.user._id, url_name: req.params.campaign_name},function(err,campaign){
		if(!campaign) return res.redirect('/dashboard')
		req.session.campaign = campaign._id;
		var share_url = req.protocol +'://' +req.headers.host
		share_url +='/'+req.user.url_name+'/'+campaign.url_name;
		return res.render(config.root + '/public/views/campaign', {name: req.user.name, campaign_name: campaign.name,share_url: share_url});
	})
});

router.get('/dashboard/:campaign_name/applicants', auth.isAuthenticated(), function(req, res){
	Campaign.findOne({client: req.user._id, url_name: req.params.campaign_name},function(err,campaign){
		if(!campaign) return res.redirect('/dashboard')
		req.session.campaign = campaign._id;
		return res.render(config.root + '/public/views/applicants', {name: req.user.name, campaign_name: campaign.name});
	})
});

router.get('/:client_name/:campaign_name', function(req, res){
	Client.findOne({url_name: req.params.client_name},function(err,client){
		Campaign.findOne({client: client._id, url_name: req.params.campaign_name},function(err,campaign){
			if(!campaign) return res.redirect('/error');
			req.session.campaign = campaign._id;
			return res.render(config.root + '/public/views/setup', {campaign_name: campaign.name});
		})
	})
});

router.get('/:client_name/:campaign_name/interview', function(req, res){
	Client.findOne({url_name: req.params.client_name},function(err,client){
		Campaign.findOne({client: client._id, url_name: req.params.campaign_name},function(err,campaign){
			if(!campaign) return res.redirect('/error');
			req.session.campaign = campaign._id;
			return res.render(config.root + '/public/views/interview', {campaign_name: campaign.name});
		})
	})
});

router.get('/error', function(req, res){
	return res.render(config.root + '/public/views/error');
});

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