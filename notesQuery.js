const
	api = require('./queryRoute'),
	util = require('util');
    stats = require('./simpleStats');

//This will contain ALL the note information for the account	
var notes;

api.queryAccountsRoute('detailednotes', function(data){
	notes = data.myNotes;
	console.log(notes[0]);
	//The bad notes and all_notes have identical structure, and will be used to bin the distinct grades and purposes
	//The 'count' property will contain the total number of notes counted.
	var bad_notes = {
		grades: {},
		purposes: {},
		count: 0
	};
	var all_notes = {
		grades: {},
		purposes: {},
		count: 0
	};
	//Iterate through the notes. Every note gets its grade and status recorded, while the bad ones get the statuses 
	//recorded in the dedicated object.
	notes.forEach(function(note){
		var status = note.loanStatus.toLowerCase();
		var bad_status = /late|charged off|grace/;
		if(status.search(bad_status) !== -1){
			incrementCounter(bad_notes, 'grades', note.grade);
			incrementCounter(bad_notes, 'purposes', note.purpose);
			bad_notes.count++;
		}
		incrementCounter(all_notes, 'grades', note.grade);
		incrementCounter(all_notes, 'purposes', note.purpose);
		incrementCounter.count++;
	});
	console.log(bad_notes);
	console.log(all_notes);
	
	var gradePercentages = [];
	var purposePercentages = [];
	//Very simple stats
	for(var grade in bad_notes.grades){
		var percentage = getPercentage(bad_notes.grades, all_notes.grades, grade);
		console.log(util.format("Stats for grade %s:", grade));
		console.log(util.format('%s of all notes (%s) in grade %s are yucky', 
			percentage.toFixed(2).toString() + '%',	all_notes.grades[grade], grade));
		gradePercentages.push({grade: grade, percentage: percentage});
	}
	
	for(var purpose in bad_notes.purposes){
		var percentage = getPercentage(bad_notes.purposes, all_notes.purposes, purpose)
		console.log(util.format("Stats for purpose %s:", purpose));
		console.log(util.format('%s of all notes (%s) having purpose %s are yucky', 
			percentage.toFixed(2).toString() + '%', all_notes.purposes[purpose], purpose));
		purposePercentages.push({purpose: purpose, percentage: percentage});
	}
	
	var gradeIQRStats = stats.getIQR( gradePercentages.map(function(gradeObj){
		return gradeObj.percentage;
	}) );
	
	console.log(gradePercentages);	
	console.log(gradeIQRStats);
});

//Add a property (purpose or grade) if it doesn't already exist, and then increment the property by one.
var incrementCounter = function(obj, baseProperty, incrementProperty){
	if(!obj[baseProperty].hasOwnProperty(incrementProperty)){
		obj[baseProperty][incrementProperty] = 0;
		return;
	}
	obj[baseProperty][incrementProperty]++;
};

//Get the percentage of the total notes having a specific grade or purpose
var getPercentage = function(bad_obj, all_obj, prop){
	return (bad_obj[prop] / all_obj[prop]) * 100;
};

var getValueOfSingleKeyValuePairObject = function(obj){
	return obj[Object.getOwnPropertyNames(obj)[0]];
}