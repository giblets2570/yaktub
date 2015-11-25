'use strict';

var express = require('express');
var controller = require('./applicant.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/answer', controller.answer);
router.post('/recording/:applicant_id/:answer_id', controller.twilioCallback);

router.get('/twilio', controller.twilio);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;