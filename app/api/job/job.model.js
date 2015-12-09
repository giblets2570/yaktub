// grab the mongoose module
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var randomstring = require("randomstring");

// module.exports allows us to pass this to other files when it is called

var jobSchema = mongoose.Schema({

	name: {type: String, default: ''},
    url_name: {type: String, default: ''},
    shareable_url: {type: String, default: ''},
    number_applicants: {type: Number, default: 0},
    send_email: {type: Boolean, default: true},
    email: {type: String, default: ''},
    client: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client'
    },
    description: {type: String, default: ''},
	questions:[{
		recording_url: String,
        text: String
	}],
    timer: {type: Number, default: 5},
    created: {
        type: Date,
        default: new Date()
    }

});

jobSchema.methods.urlSafeName = function(name) {
    var result = name.replace(/ /g,"-") + "-" + randomstring.generate(10);
    return result;
};

module.exports = mongoose.model('Job', jobSchema);