/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /campaigns              ->  index
 * POST    /campaigns              ->  create
 * GET     /campaigns/:id          ->  show
 * PUT     /campaigns/:id          ->  update
 * DELETE  /campaigns/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Campaign = require('./campaign.model');

var twilio = require('twilio');

// Get list of campaigns
exports.index = function(req, res) {
  var query = {};
  if(req.user)
    query.client = req.user._id
  Campaign.find(query,function(err,campaigns){
    if(err) { return handleError(res, err); }
    return res.status(200).json(campaigns);
  })
};

// Get a single campaign
exports.show = function(req, res) {
  if(req.params.id == 'mine')
    req.params.id = req.session.campaign;
  Campaign.findById(req.params.id, function (err, campaign) {
    if(err) { return handleError(res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    return res.json(campaign);
  });
};

// Creates a new campaign in the DB.
exports.create = function(req, res) {
  var campaign = new Campaign();
  campaign.name = req.body.name;
  campaign.url_name = campaign.urlSafeName(req.body.name);
  campaign.client = req.user._id;
  campaign.save(function(err){
    if (err) { return handleError(res, err); }
    return res.status(200).json(campaign);
  })
};

// Updates an existing campaign in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Campaign.findById(req.params.id, function (err, campaign) {
    if (err) { return handleError(res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    var updated = _.merge(campaign, req.body);
    if(req.body.questions)
      updated.questions = req.body.questions;
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(campaign);
    });
  });
};

// Deletes a campaign from the DB.
exports.destroy = function(req, res) {
  Campaign.findById(req.params.id, function (err, campaign) {
    if(err) { return handleError(res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    Campaign.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

// Deletes a campaign from the DB.
exports.remove = function(req, res) {
  Campaign.find({}).remove(function(err){
    if(err) { return handleError(res, err); }
    return res.status(200).send('Removed');
  })
};


/**
 * App logic routes outside CRUD
 */

// Deletes a campaign from the DB.

exports.make = function(req, res) {
  var resp = new twilio.TwimlResponse();
  Campaign.findById(req.body.campaign, function(err, campaign){
    if(err) { return handleError(res, err); }
    if(!campaign) {
      resp.say('Goodbye');
      return res.send(resp.toString());
    }
    var actionURL = '/api/campaigns/recording/' + campaign._id;
    resp.say("After the beep, start recording your question.")
    resp.record({
      maxLength: 1200,
      timeout: 40,
      transcribe: true,
      transcribeCallback: actionURL
    });
    return res.send(resp.toString());
  });
};

exports.twilioCallback = function(req, res) {
  var resp = twilio.TwimlResponse();
  Campaign.findById(req.params.campaign_id,function(err, campaign){
    if(err) { return handleError(res, err); }
    if(!campaign) {
      resp.say('Error in the campaign');
      return res.send(resp.toString());
    }
    var question = {
      recording_url: req.body.RecordingUrl,
      transcription_url: req.body.TranscriptionUrl,
      transcription_text: req.body.TranscriptionText,
    }
    campaign.questions.push(question);
    campaign.save(function(err){
      if(err) { return handleError(res, err); }
      resp.say('Thanks!');
      return res.send(resp.toString());
    });
  });
};



/**
 * Error handling route
 */

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}