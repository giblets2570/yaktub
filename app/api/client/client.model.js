// grab the mongoose module
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// module.exports allows us to pass this to other files when it is called

var clientSchema = mongoose.Schema({

	name: {type: String, default: ''},
    company_name: {type: String, default: ''},
	url_name: {type: String, default: ''},
	email: {type: String, default: ''},
	password: {type: String, default: ''},

	created: {
    	type: Date,
    	default: new Date()
    }
});


// methods ======================
// generating a hash
clientSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
clientSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

clientSchema.methods.urlSafeName = function(name) {
    return name.replace(/ /g,"-")
};

module.exports = mongoose.model('Client', clientSchema);