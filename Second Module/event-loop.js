const fs = require("fs");
const crypto = require("crypto");
const start = Date.now();

process.env.UV_THREADPOOL_SIZE = 1

setTimeout(() => console.log("Timer 1 Finished"), 0);
setImmediate(() => console.log("Set immediate 1 Finished"));

fs.readFile("./test-file.txt", () => {
  console.log("I/O Finished");
  setTimeout(() => console.log("Timer 2 Finished"), 0);
  setTimeout(() => console.log("Timer 3 Finished"), 3000);
  console.log("-------------------");
  setImmediate(() => console.log("Set immediate 2 Finished"));
  process.nextTick(() => console.log("Process.nextTick"));

  //Para (secret psw, ,number of interaction, key length,algorithm to encrypt the psw)
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  //by default in node for a big calculation the event loop sent (offloaded) to the other thread(4 thread in the pool by default) for making a calculation faster and dividing the works

  //if we decide to use just 1 thread instead of 4 (as we set in the top level code or in the script in the package.json) we look how much more time takes to resolve our function

  // More thread we use more is fast the calculation that is making 
  //!ALL THIS IS ASYNC IF WE PUT SYNC EVERY CALCULATION IS BLOCK THE NEXT ONE UNTIL IS RESOLVE
});

console.log("Hello from to top level code");



