/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var config = require('./config/environment');

module.exports = function(app) {

  app.use(function(req,res,next){
    // console.log(req.session);
    next();
  });

  // Insert routes below
  app.use('/api/applicants', require('./api/applicant'));
  app.use('/api/clients', require('./api/client'));
  app.use('/api/campaigns', require('./api/campaign'));
  app.use('/auth', require('./auth'));
  app.use('', require('./public'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);


  // The index page of the page
  app.route('/')
    .get(function(req, res) {
      res.render(config.root + '/public/index');
    });

  // All other routes should redirect to the index.html
  // app.route('/*')
  //   .get(function(req, res) {
  //     res.redirect('/');
  //   });
};
