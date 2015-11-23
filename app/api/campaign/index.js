'use strict';

var express = require('express');
var controller = require('./campaign.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/make', controller.make);
router.post('/recording/:campaign_id', controller.twilioCallback);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/', controller.remove);
router.delete('/:id', controller.destroy);

module.exports = router;