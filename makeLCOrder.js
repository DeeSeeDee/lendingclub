const
	filter = require("./filterLoans.js");
	api = require('./queryRoute.js');
	util = require('util');
	credentials = require('./credentials');
	
var myCash = 0;

api.queryAccountsRoute('availablecash', function(data){
	myCash = data.availableCash;
	var numLoans = Math.floor(myCash / 25);
	console.log(util.format('With %s, %s notes can be purchased.', myCash, numLoans));
	var filteredLoans = [];
	var grades = []
	filter.getFilteredLoans(true, function(data){
		filteredLoans = data.loans;
		grades = data.grades;
		if(filteredLoans.length === 0){
			console.log("No loans were found meeting the filter criteria.");
		}
		if(filteredLoans.length < numLoans){
			console.log(util.format("There are fewer than %s loans available per the filter, so we'll try to purchase %s notes.", numLoans, filteredLoans.length));
			numLoans = filteredLoans.length;
		}
		buildOrder(numLoans, filteredLoans, grades);
	});
});

var pullNoteFromGrade = function(grade, notes){
	var notesWithGrade = notes.filter(function(note){
		return note.subGrade === grade;
	});
	if(notesWithGrade.length === 0){
		return false;
	}
	if(notesWithGrade.length === 1){
		return notesWithGrade[0];
	}
	return notesWithGrade[Math.floor(Math.random() * notesWithGrade.length)];
};

var buildOrder = function(numLoans, filteredLoans, gradeArray){
	var pulledNotes = [];
	while(pulledNotes.length < numLoans){
		var selectedGrade = gradeArray[Math.floor(Math.random() * gradeArray.length)];
		var pulledNote = pullNoteFromGrade(selectedGrade, filteredLoans);
		if(pulledNote && !pulledNotes.some(elem => elem.id === pulledNote.id)){
			pulledNotes.push(pulledNote);
		}
	}
	console.log(orderData);
	var orderData = {
		aid: credentials.accountId,
		orders: []
	}
	pulledNotes.forEach(function(note){
		orderData.orders.push({
			loanId: note.id,
			requestedAmount: 25,
			portfolioId: credentials.portfolioId
		});
	});
	console.log("Submitted order data: ");
	console.log(orderData);
	console.log('\n-----------------------------------------------------------\n');
	api.placeOrder(orderData, function(data){
		if(!data.hasOwnProperty('orderConfirmations')){
			console.log('No notes were purchased this time.');
			return;
		}
		data.orderConfirmations.forEach(function(conf){
			console.log(util.format('Loan id: %s ', conf.loanId));
			console.log(util.format('Amount invested: %s' , conf.investedAmount));
			console.log(util.format("Status: %s", conf.executionStatus.join(',  ')));
			console.log('____________________\n\n');			
		});
	});
};

/*TODO
	fallback to all loans if there aren't any good new ones
	pull automated investing portfolio to make sure we aren't buying notes from the same loan twice	
*/