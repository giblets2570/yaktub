/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /jobs              ->  index
 * POST    /jobs              ->  create
 * GET     /jobs/:id          ->  show
 * PUT     /jobs/:id          ->  update
 * DELETE  /jobs/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Job = require('./job.model');
var Applicant = require('../applicant/applicant.model');

var twilio = require('twilio');
var nodemailer = require('nodemailer');

var Keen = require('keen-js');
var keenDetails = require('../../config/keen');
var keen = new Keen({
  projectId: keenDetails.projectId,
  writeKey: keenDetails.writeKey,
  readKey: keenDetails.readKey
});

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'tomkeohanemurray@gmail.com',
        pass: 'bogaboga'
    }
});

// Get list of jobs
exports.index = function(req, res) {
  var query = {};
  if(req.query.mine)
    query.client = req.user._id;
  Job.find(query,req.query.fields,function(err,jobs){
    if(err) { return handleError(res, err); }
    return res.status(200).json(jobs);
  })
};

// Get a single job
exports.show = function(req, res) {
  if(req.params.id == 'mine')
    req.params.id = req.session.job;
  if(req.params.id == 'query'){
    Job.findOne({url_name: req.query.url_name},function(err,job){
      if(err) { return handleError(res, err); }
      if(!job) { return res.status(404).send('Not Found'); }
      return res.json(job);
    })
  }else{
    Job.findById(req.params.id, function (err, job) {
      if(err) { return handleError(res, err); }
      if(!job) { return res.status(404).send('Not Found'); }
      return res.json(job);
    });
  }
};

// Creates a new job in the DB.
exports.create = function(req, res) {
  var job = new Job();
  job.name = req.body.name;
  job.url_name = job.urlSafeName(req.body.name);
  job.client = req.user._id;
  job.email = req.user.email;
  job.save(function(err){
    if (err) { return handleError(res, err); }
    var newJobEvent = {
      user: {
        name: req.user.name,
        _id: req.user._id
      },
      job: {
        _id: job._id,
        name: job.name,
        url_name: job.url_name
      },
      keen: {
        timestamp: new Date().toISOString()
      }
    };
    // Send it to the "signups" collection
    keen.addEvent("new_jobs", newJobEvent, function(err, response){
      console.log(response);
    });
    return res.status(200).json(job);
  })
};

// Updates an existing job in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Job.findById(req.params.id, function (err, job) {
    if (err) { return handleError(res, err); }
    var number_questions = job.questions.length;
    if(!job) { return res.status(404).send('Not Found'); }
    var updated = _.merge(job, req.body);
    if(req.body.questions)
      updated.questions = req.body.questions;
    if(req.body.question){
      var newQuestionEvent = {
        user: {
          name: req.user.name,
          _id: req.user._id
        },
        job: {
          _id: job._id,
          name: job.name,
          url_name: job.url_name
        },
        question: req.body.question,
        keen: {
          timestamp: new Date().toISOString()
        }
      };
      // Send it to the "signups" collection
      keen.addEvent("new_questions", newQuestionEvent, function(err, res){
        console.log(res);
      });
    }
    if(req.body.name)
      updated.url_name = updated.urlSafeName(req.body.name);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(job);
    });
  });
};

// Deletes a job from the DB.
exports.destroy = function(req, res) {
  Job.findById(req.params.id, function (err, job) {
    if(err) { return handleError(res, err); }
    if(!job) { return res.status(404).send('Not Found'); }
    Job.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

// Deletes a job from the DB.
exports.remove = function(req, res) {
  Job.find({}).remove(function(err){
    if(err) { return handleError(res, err); }
    return res.status(200).send('Removed');
  })
};


/**
 * App logic routes outside CRUD
 */

// Deletes a job from the DB.

exports.make = function(req, res) {
  var resp = new twilio.TwimlResponse();
  Job.findById(req.body.job, function(err, job){
    if(err) { return handleError(res, err); }
    if(!job) {
      resp.say('Goodbye');
      return res.send(resp.toString());
    }
    var actionURL = '/api/jobs/recording/' + job._id;
    resp.say("After the beep, start recording your question.");
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
  Job.findById(req.params.job_id,function(err, job){
    if(err) { return handleError(res, err); }
    if(!job) {
      resp.say('Error in the job');
      return res.send(resp.toString());
    }
    var question = {
      recording_url: req.body.RecordingUrl,
      transcription_url: req.body.TranscriptionUrl,
      transcription_text: req.body.TranscriptionText,
    }
    job.questions.push(question);
    job.save(function(err){
      if(err) { return handleError(res, err); }
      resp.say('Thanks!');
      return res.send(resp.toString());
    });
  });
};

exports.finish = function(req, res){
  Job.findById(req.params.id, function(err,job){
    if(err) { return handleError(res, err); }
    if(!job || !job.send_email) return res.status(200).send('Notification not sent');
      // send mail with defined transport object
      var host = req.protocol + '://' + req.get('Host');
      var html = '<h1>New applicant for your job '+job.name+'</h1><br/><br/><p> View the new applicant <a href="'+host+'/home/'+job.url_name+'/applicants/'+req.params.applicant_id+'" target="_blank">here</a>.';
      transporter.sendMail({
        from: 'Yak tub <tomkeohanemurray@gmail.com>', // sender address
        to: job.email, // list of receivers
        subject: 'New applicant!', // Subject line
        html: html // html body
      }, function(error, info){
        if(error){
          console.log(error)
          return res.status(200).json(error);
        }
        console.log('Message sent: ' + info.response);
        return res.status(200).send('Message sent: ' + info.response);
      });
  })
}


/**
 * Error handling route
 */

function handleError(res, err) {
  return res.status(500).send(err);
}