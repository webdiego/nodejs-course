const fs = require("fs");
const http = require("http");
const url = require("url");
//Blocking, synchronous way

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)

// const textOut ='Im writing from the ide'
// fs.writeFileSync('./txt/output.txt', textOut )

// console.log('File Written')

//No-blocking, asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err,data1)=>{
//   fs.readFile(`./txt/${data1}.txt` ,'utf-8', (err,data2)=>{
//     fs.readFile(`./txt/append.txt` ,'utf-8', (err,data3)=>{
//       console.log(data3)

//       fs.writeFile('./txt/final.txt',`${data2}\n${data3}` , 'utf-8', err =>{
//         console.log('File written')
//       })
//     })
//     })
// })

//SERVER

//CREATE A SERVER
//req=request
//res=response, send out to the client a response

//SECOND STEP
//WE put in the top level so this is gonna execute only once
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    res.end("Your are in overview page");
  } else if (pathName === "/product") {
    res.end("You are in in the product page");
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    //FIRST STEP
    //In this case we have to read each time and then send back the request anytime we hit "/api"
    // fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8', (err,data)=>{
    //   const productData = JSON.parse(data)
    //   res.writeHead(200, {
    //     "Content-type": "application/json",
    //   });
    //   res.end(data);
    // } )
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1>no no no no</h1>");
  }
  console.log(req.url);
  // res.end('Hi from the server')
});

//LISTEN TO THE SERVER

//arguments = 1-port ,2-host (localhost in this case)
server.listen(8000, "127.0.0.1", () => {
  console.log("Listened to request on port 8000");
});
