module.exports = {
//Get the median of an array of integers
//This function assumes the array is already sorted
	getMedian: function(values){
		var halfway = Math.floor(values.length/2);
		if(values.length % 2 !== 0){
			return values[halfway]; 
		} 
		return (values[halfway - 1] + values[halfway]) / 2.0;	
	},
	
	getMean: function(values){
		//multiply by 1.0 to ensure floating point
		var sum = values.reduce(function(a, b){
			return a + b;
		}) * 1.0;
		return sum/values.length;
	},

	getStandardDeviation: function(values){
		var valuesMean = this.getMean(values);
		var squaredSumsOfDiff = [];
		values.forEach(function(value){
			squaredSumsOfDiff.push(Math.pow((value - valuesMean), 2));
		});
		return Math.sqrt(this.getMean(squaredSumsOfDiff));
	},
	
	numericSortAscending: function(values){
		return values.sort(function(a,b){
			return a - b;
		});
	},
	
	numericSortDescending: function(values){
		return values.sort(function(a,b){
			return b - a;
		});
	},
	
	getIQR: function(values){
		values = this.numericSortAscending(values);
		var median = this.getMedian(values);
		var lowerValues = values.filter(function(value){
			return value < median;
		});
		var upperValues = values.filter(function(value){
			return value > median;
		});
		var q1Median = this.getMedian(lowerValues);
		var q3Median = this.getMedian(upperValues);
		var IQR = q3Median - q1Median;
		var upperLimit = (1.5 * IQR) + q3Median;
		var lowerLimit = q1Median - (1.5 * IQR);
		return {
			upper: upperLimit, 
			lower: lowerLimit,
			q1: q1Median,
			q3: q3Median,
			IQR: IQR			
		}
	}
}