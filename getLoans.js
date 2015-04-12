const
	api = require('./queryRoute'),
	util = require('util');
	
api.queryLoansRoute('listing', function(data){
	var loans = data.loans;
	var investLocally = loans.filter(function(value){
		if(!value.empTitle){
			return false;
		}
		return value.empTitle.toLowerCase().indexOf('engineer') !== -1;
	});
	console.log(util.format('%s loans for engineers', investLocally.length));
}, true);