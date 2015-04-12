var assert = require('assert');
var stats = require('./simpleStats.js');

var testSortArray = [5,3,1,8,3,10,4,8,4];
var testStatsArray = [2,3,4,5,6,7];
var testStatsArray2 = [2,3,4,5,6,7,8];
var IQRArray = [3,7,7,8,8,9,10,10,12,14,15,30];
var IQRResult = stats.getIQR(IQRArray);

assert.deepEqual(stats.getMean(testStatsArray2), 5.0, 'Test the mean.');
assert.deepEqual(stats.getMedian(testStatsArray), 4.5, 'Test the median with an even number of values.');
assert.deepEqual(stats.getMedian(testStatsArray2), 5, 'Test the media with an odd number of values.');
assert.deepEqual(IQRResult.upper, 21.25, "Upper limit of IQR Test.");
assert.deepEqual(IQRResult.lower, -0.75, "Lower limit of IQR Test.")

stats.numericSortAscending(testSortArray);
assert.deepEqual(testSortArray[0], 1, 'First element of sorted (ascending) array.');
assert.deepEqual(testSortArray[testSortArray.length - 1], 10, 'Last element of sorted (ascending) array.');

stats.numericSortDescending(testSortArray);
assert.deepEqual(testSortArray[0], 10, 'First element of sorted (descending) array.');
assert.deepEqual(testSortArray[testSortArray.length - 1], 1, 'Last element of sorted (descending) array.');