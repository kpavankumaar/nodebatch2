// dependencies 
var fs = require('fs');
// country object 
var country = {}

// get all the country names  and return them to the user
country.allCountries = function(){
	// read the file containing the countries 
	console.log(__dirname+'/country.txt');
	var fileContents = fs.readFileSync(__dirname+'/country.txt','utf8');
	console.log(fileContents);
	var typeOfContent = typeof fileContents;
	console.log('typeOfContent', typeOfContent);
	// turn the string into and array 
	var arrayOfCountries  = fileContents.split(/\n/gm);

	return arrayOfCountries
}

// export the library
module.exports = country;