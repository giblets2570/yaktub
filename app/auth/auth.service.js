'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
// var jwt = require('jsonwebtoken');
// var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
// var validateJwt = expressJwt({
//   secret: config.secrets.session
// });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */

function isAuthenticated(){
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (!req.isAuthenticated()){
        // return res.status(401).send('Unauthorized');
        // return res.status(401).render(config.root + '/public/assets/errors/unauthorized');
        return res.redirect('/login');
      }
      return next();
    })
};

/**
 * Checks if the user role meets the minimum requirements of the route
 */

function hasRole(roleRequired) {
  if (!roleRequired)
    throw new Error('Required role needs to be set');
  if(roleRequired == 'agent')
    // return isAgent();
    return;
  if(roleRequired == 'client')
    return;
    // return isClient();
  // return res.status(403).send('Forbidden');
  // return res.status(403).render(config.root + '/public/assets/errors/forbidden');
  return res.redirect('/');
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;