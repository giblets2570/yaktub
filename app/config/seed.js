/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Applicant = require('../api/applicant/applicant.model');

Applicant.find({}).remove(function() {
  console.log('Applicants removed')
})