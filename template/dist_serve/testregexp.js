var pathToRegexp = require('path-to-regexp')
var re = pathToRegexp("/123")
// /*[11]+
console.log(re)
console.log(re.exec('/11.hh'))
console.log(re.exec('/test/route'))


// /^123(?:\/)?$/i
// /^   (?:\/)?$/i

