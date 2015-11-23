/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /clients              ->  index
 * POST    /clients              ->  create
 * GET     /clients/:id          ->  show
 * PUT     /clients/:id          ->  update
 * DELETE  /clients/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Client = require('./client.model');

var twilio = require('twilio');
var outgoingNumber = require('../../config/twilio').outgoingNumber;
var twilioDetails = require('../../config/twilio');
var twilio = require('twilio');
var capability = new twilio.Capability(twilioDetails.accountID, twilioDetails.authToken);
capability.allowClientOutgoing(twilioDetails.clientAppID);


// Get list of clients
exports.index = function(req, res) {
  Client.find(function(err,clients){
    if(err) { return handleError(res, err); }
    return res.status(200).json(clients);
  })
};

// Get a single client
exports.show = function(req, res) {
  Client.findById(req.params.id, function (err, client) {
    if(err) { return handleError(res, err); }
    if(!client) { return res.status(404).send('Not Found'); }
    return res.json(client);
  });
};

// Creates a new client in the DB.
exports.create = function(req, res) {
  var client = new Client();
  var updated = _.merge(client, req.body);
  updated.save(function (err) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(client);
  });
};

// Updates an existing client in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Client.findById(req.params.id, function (err, client) {
    if (err) { return handleError(res, err); }
    if(!client) { return res.status(404).send('Not Found'); }
    var updated = _.merge(client, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(client);
    });
  });
};

// Deletes a client from the DB.
exports.destroy = function(req, res) {
  Client.findById(req.params.id, function (err, client) {
    if(err) { return handleError(res, err); }
    if(!client) { return res.status(404).send('Not Found'); }
    Client.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};


/**
 * App logic routes outside CRUD
 */

// Get's a twilio token for an agent, and also returns the agents id
exports.twilio = function(req, res){
  var token = capability.generate();
  return res.status(201).json(token);
}

/**
 * Error handling route
 */

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}