const
	api = require('./queryRoute.js');
	
api.queryAccountsRoute('availablecash', function(data){
	console.log(data.availableCash);
});