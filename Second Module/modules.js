// console.log(arguments)
// (function(exports,require, module, __filename,__dirname){
//!Module code lives here
// })
//we can see here
//console.log(require('module').wrapper)

// module.export
const calc = require("./test-module-1");

const calc1 = new calc();
console.log(calc1.multiply(2, 2));

//export
const calc2 = require("./test-module-2");
const { add, multiply } = require("./test-module-2");
console.log(add(2, 5));

//Caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
//as we se the first console log is return just one time and the console.log from the function 3 times ,even if we require and fire the function 3 time
//that because of caching,the module is loaded only one time so the console.log from the function is also executed only once.
// the other 2 logging is from cache where are stored
