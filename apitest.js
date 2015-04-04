var api = require('./queryRoute');

api.queryRoute('availablecash', function(data){
	console.log("Success!");
	console.log(data);
	console.log('Account Balance: $' + data.availableCash);
});