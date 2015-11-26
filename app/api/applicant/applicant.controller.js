/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /calls              ->  index
 * POST    /calls              ->  create
 * GET     /calls/:id          ->  show
 * PUT     /calls/:id          ->  update
 * DELETE  /calls/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Applicant = require('./applicant.model');
var Job = require('../job/job.model');

var twilio = require('twilio');
var outgoingNumber = require('../../config/twilio').outgoingNumber;
var twilioDetails = require('../../config/twilio');
var twilio = require('twilio');
var capability = new twilio.Capability(twilioDetails.accountID, twilioDetails.authToken);
capability.allowClientOutgoing(twilioDetails.applicantAppID);

// Get list of calls
exports.index = function(req, res) {
  var query = {}
  if(req.query.job)
    query.job = req.query.job;
  Applicant.find(query,function(err,applicants){
    if(err) { return handleError(res, err); }
    return res.status(200).json(applicants);
  })
};

// Get a single call
exports.show = function(req, res) {
  Applicant.findById(req.params.id, function (err, applicant) {
    if(err) { return handleError(res, err); }
    if(!applicant) { return res.status(404).send('Not Found'); }
    return res.json(applicant);
  });
};

// Creates a new applicant in the DB.
exports.create = function(req, res) {
  var applicant = new Applicant();
  var updated = _.merge(applicant, req.body);
  updated.save(function (err) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(applicant);
  });
};

// Updates an existing call in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Applicant.findById(req.params.id, function (err, applicant) {
    if (err) { return handleError(res, err); }
    if(!applicant) { return res.status(404).send('Not Found'); }
    var updated = _.merge(applicant, req.body);
    if(req.body.answers)
      updated.answers = req.body.answers;
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(applicant);
    });
  });
};

// Deletes a call from the DB.
exports.destroy = function(req, res) {
  Call.findById(req.params.id, function (err, call) {
    if(err) { return handleError(res, err); }
    if(!call) { return res.status(404).send('Not Found'); }
    Call.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

// Get's a twilio token for an agent, and also returns the agents id
exports.twilio = function(req, res){
  Applicant.findById(req.query.applicant, function(err, applicant){
    if(err) { return handleError(res, err); }
    if(!applicant) { return res.status(403).json({'message': 'No agent'}); }
    var token = capability.generate();
    return res.status(201).json(token);
  });
}


/**
 * App logic routes outside CRUD
 */

// Deletes a call from the DB.

exports.answer = function(req, res) {
  Applicant.findById(req.body.applicant,function(err, applicant){
    if(err) { return handleError(res, err); }
    if(!applicant) { return res.status(401).send('0'); }
    if(req.body.question){
      applicant.answers.push({
        question: req.body.question
      });
      applicant.save(function(err){
        if(err) { return handleError(res, err); }
        var k;
        for (var i = applicant.answers.length - 1; i >= 0; i--) {
          if(applicant.answers[i].text == req.body.text){
            k = i;
            break;
          }
        }
        var id = applicant.answers[k]._id;
        var actionURL = '/api/applicants/recording/' + applicant._id + '/' + id;
        var resp = new twilio.TwimlResponse();
        resp.say("Record after the beep.")
        resp.record({
          action: actionURL,
          maxLength: 1200,
          timeout: 40
        });
        return res.send(resp.toString());
      })
    }
  });
};

exports.twilioCallback = function(req, res) {
  var resp = twilio.TwimlResponse();
  Applicant.findById(req.params.applicant_id,function(err, applicant){
    if(err) { return handleError(res, err); }
    if(!applicant) {
      resp.say('Error in the applicant');
      return res.send(resp.toString());
    }
    var answer = applicant.answers.id(req.params.answer_id);
    answer.recording_url = req.body.RecordingUrl;
    answer.duration = parseInt(req.body.RecordingDuration, 10);
    applicant.save(function(err){
      if(err) { return handleError(res, err); }
      resp.say('Thanks for calling!');
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