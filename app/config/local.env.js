'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:8080',
  SESSION_SECRET: "yakhubio2-secret",
  // Control debug level for modules using visionmedia/debug
  DEBUG: '',
  TWILIO_ACCOUNT_ID: 'AC9e540d572431d3af66681b92102093ca',
  TWILIO_AUTH_TOKEN: '9471ecbe5ca0433876c309e242cf2aa5',
  TWILIO_APPLICANT_APP_ID: 'AP9ff097987bfa0068f1c53a33bb677f87',
  TWILIO_NUMBER: '+441143031601',
  TWILIO_CLIENT_APP_ID: 'AP9ff097987bfa0068f1c53a33bb677f87',
  PROJECT_ID: "56a7b79890e4bd183bea7674", // String (required always)
  WRITE_KEY: "9aa00a6288ef875c6bc9a25a2ab5cf7be957442dfbcc49a74464ad286823862696cc4924a0d0301f8b9d3768dfedfeb9cbb3271621a4504722584e81b96b83cf877c6bcd282f1e3dcda316deed65e9c12724c51e2c78bb2f17b93759c25f0d7c",
  READ_KEY: "a3788953530a0422d7194fa3d5e41a6e8da4dd3c308e2344f55a33725af1c7119e776a49fae74341769653448152bad5f73e4792ece0764c2541f71a9c27b55ca0cb71be1a40d78d884d810e51e41ec64e8e130096ab9e2e470920ab2c91a318",
  REDISCLOUD_URL: 'redis://localhost:6379',
  MAILGUN_API_KEY: 'key-a2ac2c97eade36969cb4c9b08fba89a5',
  MAILGUN_DOMAIN: 'appab6ab274fa7c4059a57125865a82d517.mailgun.org',
  MAILGUN_PUBLIC_KEY: 'pubkey-9258a76e84e3132427d09ae884227839',
  MAILGUN_SMTP_LOGIN: 'postmaster@appab6ab274fa7c4059a57125865a82d517.mailgun.org',
  MAILGUN_SMTP_PASSWORD: '1820f11f57f4eb7e25e9b90d501953bb',
  MAILGUN_SMTP_PORT: '587',
  MAILGUN_SMTP_SERVER: 'smtp.mailgun.org',
  AWS_ACCESS_KEY_ID: 'AKIAJN2VFCREKJDHEFPA',
  AWS_SECRET_KEY: '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',
};
