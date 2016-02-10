// grab the mongoose module
var mongoose = require('mongoose');

// module.exports allows us to pass this to other files when it is called

var applicantSchema = mongoose.Schema({

	name: {type: String, default: ''},
	email: {type: String, default: ''},
	phone: {type: String, default: ''},

	job: {
		type: mongoose.Schema.ObjectId,
		ref: 'Job'
	},
	started: {type: Boolean, default: false},
	created: {
    	type: Date,
    	default: new Date()
    },

	answers:[{
		question: String,
		// Data from twilio
		recording_url: {type : String, default: ''},
		// duration: {type : Number, default: 0},
	}],

	score: {type: Number, default: 0},

	// Client driven data from the applicant
	followed_up: {type : Boolean, default: false},
	archived: {type : Boolean, default: false},

	notes: {type : String, default: ''},
});

module.exports = mongoose.model('Applicant', applicantSchema);