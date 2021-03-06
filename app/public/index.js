'use strict';

var express = require('express');

var router = express.Router();
var config = require('../config/environment');
var auth = require('../auth/auth.service');
var url = require('url');

var Job = require('../api/job/job.model')
var Client = require('../api/client/client.model')

router.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  console.log(name);
  return res.render('partials/' + name);
});

module.exports = router;