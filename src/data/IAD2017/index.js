var fs = require('fs')
var moment = require('moment');

let dataFile = './semester2018FS.yaml'

fs.readFile(dataFile, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  var result = data;

  // remove old values
  result = result.replace(/([ ]{10}[a-z]+:)(.*)/g, '$1 ');

  // update dates
  result = result.replace(/KW([0-9]+)-([0-9]+)/g, function myFunction(date){
    return new moment(date, '[KW]ww-YYYY').add(26, 'weeks').format('[KW]ww-YYYY');
  });

  fs.writeFile(dataFile, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
