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
  TWILIO_APPLICANT_APP_ID: 'AP9ff097987bfa0068f1c53a33bb677f87',
  TWILIO_NUMBER: '+441143031601',
  TWILIO_CLIENT_APP_ID: 'AP9ff097987bfa0068f1c53a33bb677f87',
  PROJECT_ID: "56a750c996773d2cd5ec3825", // String (required always)
  WRITE_KEY: "6a610af4c7198fe13c09013218c01ce14a0c1dfa8bfad863d37c0b37073dc33cdaebe3cbfb624e84a7f15defb718fa9bb3632e9d9cc5a75428397868d45435e0174f641660790879db01d2a99086dfc312e6598b4f72be832c25d943d148b0e4",   // String (required for sending data)
  READ_KEY: "ba1d5e52b3b44dd5db743883516604958ec20a278fd57588c73fc7e756309e597c2f10233815a93ffe7a5ebfef97bb788c2f7011efaf0af7338f75d31f1d6853213e1f41e87f3f93f4bebf2bb442f12e108b4df2d309bb61225d3870bbe5a20e" ,    // String (required for querying data)
  REDISCLOUD_URL: 'redis://localhost:6379'
};
