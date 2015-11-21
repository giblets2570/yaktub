/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /admins              ->  index
 * POST    /admins              ->  create
 * GET     /admins/:id          ->  show
 * PUT     /admins/:id          ->  update
 * DELETE  /admins/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Admin = require('./admin.model');

// Get list of admins
exports.index = function(req, res) {
  Admin.find(function (err, admins) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(admins);
  });
};

// Get a single admin
exports.show = function(req, res) {
  Admin.findById(req.params.id, function (err, admin) {
    if(err) { return handleError(res, err); }
    if(!admin) { return res.status(404).send('Not Found'); }
    return res.json(admin);
  });
};

// Creates a new admin in the DB.
exports.create = function(req, res) {
  var admin = new Admin();
  admin.name = req.body.name;
  admin.password = admin.generateHash(req.body.password);
  admin.save(function(err) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(admin);
  });
};

// Updates an existing admin in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Admin.findById(req.params.id, function (err, admin) {
    if (err) { return handleError(res, err); }
    if(!admin) { return res.status(404).send('Not Found'); }
    var updated = _.merge(admin, req.body, function(a, b) {
      if (_.isArray(a)) {
        return a.concat(b);
      }
    });
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(admin);
    });
  });
};

// Deletes a admin from the DB.
exports.destroy = function(req, res) {
  Admin.findById(req.params.id, function (err, admin) {
    if(err) { return handleError(res, err); }
    if(!admin) { return res.status(404).send('Not Found'); }
    Admin.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}