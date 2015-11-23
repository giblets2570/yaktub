// config/twilio.js
module.exports = {
    applicantAppID : process.env.TWILIO_APPLICANT_APP_ID,
    clientAppID: process.env.TWILIO_CLIENT_APP_ID,
    accountID : process.env.TWILIO_ACCOUNT_ID,
    authToken : process.env.TWILIO_AUTH_TOKEN,
    outgoingNumber : process.env.TWILIO_NUMBER
}