'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:8080',
  SESSION_SECRET: "yakhubio-secret",
  // Control debug level for modules using visionmedia/debug
  DEBUG: '',
  TWILIO_ACCOUNT_ID: 'AC9e540d572431d3af66681b92102093ca',
  TWILIO_AUTH_TOKEN: '9471ecbe5ca0433876c309e242cf2aa5',
  TWILIO_APPLICANT_APP_ID: 'AP43556df05f77410b66c486fa9c38dd40',
  TWILIO_NUMBER: '+441143031601',
  TWILIO_CLIENT_APP_ID: 'AP9ff097987bfa0068f1c53a33bb677f87'
};
