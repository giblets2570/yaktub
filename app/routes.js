/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var config = require('./config/environment');

module.exports = function(app) {

  // Redirect all HTTP traffic to HTTPS
  function ensureSecure(req, res, next){
    if(req.headers["x-forwarded-proto"] === "https"){
      // OK, continue
      return next();
    };
    res.redirect('https://'+req.hostname+req.url);
  };

  // Handle environments
  if (process.env.NODE_ENV === 'production') {
    app.all('*', ensureSecure);
  }

  app.use(function(req,res,next){
    next();
  });

  // Insert routes below
  app.use('/api/applicants', require('./api/applicant'));
  app.use('/api/clients', require('./api/client'));
  app.use('/api/jobs', require('./api/job'));
  app.use('/auth', require('./auth'));
  app.use('', require('./public'));

  // All undefined asset or api routes should return a 404
  // All undefined asset or api routes should return a 404

  app.route('/signup')
    .get(function(req, res) {
      res.render(config.root + '/public/signup');
    });

  // The index page of the page
  app.route('/')
    .get(function(req, res) {
      res.render(config.root + '/public/index');
    });
  app.route('*')
    .get(function(req, res) {
      res.render(config.root + '/public/index');
    });
  // All other routes should redirect to the index.html
  // app.route('/*')
  //   .get(function(req, res) {
  //     res.redirect('/');
  //   });
};
