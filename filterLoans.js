const
	api = require('./queryRoute'),
	util = require('util');
	stats = require('./simpleStats');

var gradePicker = [];
var states = ['WY','AK','DC','WV','CO','MT','AR','TX','SC','OK','KS','NH'];
var purposes = /car|consoli|card|improvement/;
var grades = ['A1','A2','A3','A4','E1', 'E2', 'E3', 'B1', 'B2','B3', 'C2'];
var houseStatus = ['rent', 'own', 'mortgage'];

api.queryLoansRoute('listing', function(data){
	console.log(util.format('Examining %s loans', data.loans.length));
	var filteredNotes = data.loans.filter(function(loan){
		if(states.indexOf(loan.addrState.toUpperCase()) === -1){
			return false;
		}
		if(loan.purpose.search(purposes) === -1){
			return false;
		}
		if(houseStatus.indexOf(loan.homeOwnership.toLowerCase()) === -1){
			return false;
		}
		if(loan.ficoRangeLow < 700){
			return false;
		}
		var creditStartYear = parseInt(loan.earliestCrLine.split('-')[0]);
		if(isNaN(creditStartYear) || parseInt(creditStartYear) > 1999){
			return false;
		}
		var empLength = parseInt(loan.empLength);
		if(isNaN(empLength) || empLength < 1){
			return false;
		}
		var income = parseInt(loan.annualInc);
		if(isNaN(income) || income < 70000){
			return false;
		}
		return true;
	});
	console.log(util.format('kept %s out of %s notes', filteredNotes.length, data.loans.length));
	
	var foundGrades = [];
	
	filteredNotes.forEach(function(note){
		if(foundGrades.indexOf(note.subGrade) === -1){
			foundGrades.push(note.subGrade);
		}
	});
	
	foundGrades.sort();
	console.log(foundGrades);	
	
	for(var i = foundGrades.length; i >= 1; i--){
		for(var j = 0; j < i; j++){		
			gradePicker.push(foundGrades[i - 1]);
		}
	}
	
	console.log(gradePicker);
}, true);