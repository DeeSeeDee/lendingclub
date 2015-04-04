const
	api = require('./queryRoute'),
	util = require('util');

var notes;
var statuses = [];

api.queryRoute('detailednotes', function(data){
	notes = data.myNotes;
	console.log(notes[0]);
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
	for(var grade in bad_notes.grades){
		console.log(util.format("Stats for grade %s:", grade));
		console.log(util.format('%s of all notes (%s) in grade %s are yucky', getPercentage(bad_notes.grades, all_notes.grades, grade), bad_notes.grades[grade], grade));
	}
	for(var purpose in bad_notes.purposes){
		console.log(util.format("Stats for purpose %s:", purpose));
		console.log(util.format('%s of all notes (%s) having purpose %s are yucky', getPercentage(bad_notes.purposes, all_notes.purposes, purpose), all_notes.purposes[purpose], purpose));
	}
});

var incrementCounter = function(obj, baseProperty, incrementProperty){
	if(!obj[baseProperty].hasOwnProperty(incrementProperty)){
		obj[baseProperty][incrementProperty] = 0;
		return;
	}
	obj[baseProperty][incrementProperty]++;
};

var getPercentage = function(bad_obj, all_obj, prop){
	return (((bad_obj[prop] / all_obj[prop]) * 100).toFixed(2)).toString() + '%';
};