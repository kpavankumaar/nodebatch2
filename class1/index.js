var mathLib = require('./lib/math');
var countryLib = require('./lib/country')

var num = mathLib.getRandomNumber(1,5);
console.log(num);
console.log(countryLib.allCountries())