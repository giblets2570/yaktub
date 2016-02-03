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

// Get aws details
var awsDetails = require('../../config/aws');
var crypto = require('crypto');

var twilio = require('twilio');
var outgoingNumber = require('../../config/twilio').outgoingNumber;
var twilioDetails = require('../../config/twilio');
var twilio = require('twilio');
var capability = new twilio.Capability(twilioDetails.accountID, twilioDetails.authToken);
capability.allowClientOutgoing(twilioDetails.applicantAppID);

var Keen = require('keen-js');
var keenDetails = require('../../config/keen');
var keen = new Keen({
  projectId: keenDetails.projectId,
  writeKey: keenDetails.writeKey,
  readKey: keenDetails.readKey
});

// Get list of calls
exports.index = function(req, res) {
  var query = {}
  if(req.query.job)
    query.job = req.query.job;
  Applicant.find(query,req.query.fields,function(err,applicants){
    if(err) { return handleError(res, err); }
    return res.status(200).json(applicants);
  })
};

// Get a single call
exports.show = function(req, res) {
  Applicant.findById(req.params.id, req.query.fields, function (err, applicant) {
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
    Job.findById(applicant.job, function(err, job){
      var newApplicantEvent = {
        applicant: {
          _id: applicant._id,
          name: applicant.name,
          email: applicant.email,
          phone: applicant.phone
        },
        job:{
          _id: job._id,
          name: job.name,
          url_name: job.url_name
        },
        keen: {
          timestamp: new Date().toISOString()
        }
      };
      keen.addEvent("new_applicants", newApplicantEvent, function(err, response){
        if (err) {console.log(err)};
        console.log(response);
      });
    });
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
    console.log(token);
    return res.status(201).json(token);
  });
}


/**
 * App logic routes outside CRUD
 */

// Answers the question

exports.answer = function(req, res) {
  Applicant.findById(req.body.applicant,function(err, applicant){
    if(err) { return handleError(res, err); }
    if(!applicant) { return res.status(401).send('0'); }
    if(req.body.question){
      var index = applicant.answers.push({
        question: req.body.question
      });
      applicant.save(function(err){
        if(err) { return handleError(res, err); }
        var id = applicant.answers[index-1]._id;
        var actionURL = '/api/applicants/recording/' + applicant._id + '/' + id;
        var resp = new twilio.TwimlResponse();
        resp.say("Record after the beep.")
        resp.record({
          action: actionURL,
          maxLength: 1200,
          timeout: 40
        });
        console.log(resp.toString());
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
    if(answer.recording_url == ""){
      var index;
      for (var i = applicant.answers.length - 1; i >= 0; i--) {
        if(applicant.answers[i]._id.toString() == answer._id.toString()){
          index = i;
          break;
        }
      };
      applicant.answers.splice(index,1);
    }
    applicant.save(function(err){
      if(err) { return handleError(res, err); }
      resp.say('Thanks for calling!');
      return res.send(resp.toString());
    });
  });
};

exports.upload = function(req, res){
  var bucket_name = 'yakhub-chats';
  var myS3Account = new s3instance(awsDetails.aws_access_key_id, awsDetails.aws_secret_key);
  var policy = myS3Account.writePolicy('uploads/', bucket_name, 60, 10);
  return res.json(policy);
}

function s3instance(accessKey, secretKey) {

  this.accessKey = accessKey;
  this.secretKey = secretKey;

  this.writePolicy = function(key, bucket, duration, filesize) {
    var dateObj = new Date;
    var dateExp = new Date(dateObj.getTime() + duration * 1000);
    var policy = {
      "expiration":dateExp.getUTCFullYear() + "-" + dateExp.getUTCMonth() + 1 + "-" + dateExp.getUTCDate() + "T" + dateExp.getUTCHours() + ":" + dateExp.getUTCMinutes() + ":" + dateExp.getUTCSeconds() + "Z",
      "conditions":[
        { "bucket":bucket },
        ["starts-with", "$key", ""],
        { "acl":"public-read" },
        ["starts-with", "$Content-Type", ""],
        ["content-length-range", 0, 10 * 1024 * 1024]
      ]
    };
    var policyString = JSON.stringify(policy);
    var policyBase64 = new Buffer(policyString).toString('base64');
    var signature = crypto.createHmac("sha1", this.secretKey).update(policyBase64);
    var accessKey = this.accessKey;
    var s3Credentials = {
      policy:policyBase64,
      signature:signature.digest("base64"),
      key:accessKey
    };
    return s3Credentials;
  };
}

/**
 * Error handling route
 */

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}