const
	https = require('https'),
	util = require('util'),
	credentials = require('./credentials'),
	helpers = require('./helpers'),
	querystring = require('querystring');

module.exports = {
	queryAccountsRoute: function(routeName, callback){
		var uri = util.format('/api/investor/%s/accounts/%s/%s', helpers.version, credentials.accountId, routeName);
		queryRouteGet(uri, function(data){
			callback(data);
		});
	},
	
	queryLoansRoute: function(routeName, callback, showAll){
		var uri = util.format('/api/investor/%s/loans/%s', helpers.version, routeName);
		if(showAll){
			uri += '?showAll=true'
		}
		queryRouteGet(uri, function(data){
			callback(data);
		});
	},
	
	placeOrder: function(loans, callback){
		var uri = util.format('/api/investor/%s/accounts/%s/orders', helpers.version, credentials.accountId);
		queryRoutePost(uri, function(data){
			callback(data);
		}, loans);
	}
};

var queryRouteGet = function(uri, callback){
	var options = helpers.api_base;
	options.headers['Authorization'] = credentials.api_key;
	options.path = uri
	
	var response = '';
	
	var api_req = https.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
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
};

var queryRoutePost = function(uri, callback, data){
	var post_data = JSON.stringify(data);
	var options = helpers.api_base;
		options.headers['Authorization'] = credentials.api_key;
		options.headers['Content-Type'] = 'application/json';
		options.headers['Content-Length'] = post_data.length;
		options.method = "POST";
		options.path = uri;
		console.log(options);
	
	var api_req = https.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		res.setEncoding('utf8');
		var response = '';
		
		res.on('data', function(chunk){
			response += chunk;
		});
		
		res.on('end', function(){
			callback(JSON.parse(response));
		});
		
	});
	api_req.write(post_data);
	api_req.end();
	api_req.on('error', function(err){
		console.log(err);
	});
};