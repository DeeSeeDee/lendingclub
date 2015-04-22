const
	api = require('./queryRoute'),
	util = require('util');
	stats = require('./simpleStats');

//Each grade in the 'grades' object has an array of interest rates
var grades = {};
var badStatus = /late|charged off|grace|default/;

api.queryAccountsRoute('detailednotes', function(data){
	data.myNotes.forEach(function(note){
		var grade = note.grade;
		if(!grades.hasOwnProperty(grade)){
			grades[grade] = {
				interestRates: [],
				bads: []
			};
		}
		grades[grade]['interestRates'].push(note.interestRate);
		if(note.loanStatus.toLowerCase().search(badStatus) !== -1){
			grades[grade]['bads'].push(note.interestRate);
		}
	});
	
	sortedGrades = Object.keys(grades).sort();	
	
	sortedGrades.forEach(function(grade){
		//shorthand variable for the array of interest rates in a grade
		var allG = grades[grade]['interestRates'];
		console.log(util.format('\n\nDetails for grade %s:', grade));
		console.log('----------------------');
		console.log(util.format('Total: %s', allG.length));
		console.log(util.format('Highest rate: %s', stats.numericSortDescending(allG)[0]));
		console.log(util.format('Lowest rate: %s', stats.numericSortAscending(allG)[0]));
		console.log(util.format('Mean rate: %s', stats.getMean(allG).toFixed(2)));
		console.log(util.format('Std dev: %s', stats.getStandardDeviation(allG).toFixed(2)));
		console.log(util.format('Percent problematic: %s %', 
			((grades[grade]['bads'].length * 1.0)/grades[grade]['interestRates'].length * 100).toFixed(2) ))
		if(grades[grade]['bads'].length > 0){
			console.log(util.format('Interest rates for problematic loans: %s', 
				grades[grade]['bads'].join(', ')));
		} else {
			console.log("This grade has NO problematic loans.");
		}
	});
});