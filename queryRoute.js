const
	https = require('https'),
	util = require('util'),
	credentials = require('./credentials'),
	helpers = require('./helpers');

module.exports = {
	queryRoute: function(routeName, callback){
		var options = helpers.api_base;
		options.headers['Authorization'] = credentials.api_key;
		options.path = util.format('/api/investor/%s/accounts/%s/%s', helpers.version, credentials.account_id, routeName);
		
		var response = '';
		
		var api_req = https.request(options, function(res) {
			console.log('STATUS: ' + res.statusCode);
			console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			res.on('data', function(chunk){
				response += chunk;
			});
			res.on('end', function(){
				callback(JSON.parse(response));
			});
		});

		api_req.end();
		api_req.on('error', function(err){
			console.log(err);
		});
	}
};