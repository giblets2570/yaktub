// grab the mongoose module
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// module.exports allows us to pass this to other files when it is called

var campaignSchema = mongoose.Schema({

	name: {type: String, default: ''},
    url_name: {type: String, default: ''},
    client: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client'
    },
    description: {type: String, default: ''},
	questions:[{
		recording_url: String,
		transcription_url: String,
        transcription_text: String,
	}],
    created: {
        type: Date,
        default: new Date()
    }

});

campaignSchema.methods.urlSafeName = function(name) {
    return name.replace(/ /g,"-")
};

module.exports = mongoose.model('Campaign', campaignSchema);