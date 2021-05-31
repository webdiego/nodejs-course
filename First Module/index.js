//*CORE MODULES
const fs = require("fs");
const http = require("http");
const url = require("url");
const querystring = require("querystring");
//*THIRD-PARTY MODULES
const slugify = require("slugify");
//slug is just the last part of the url that contains unique value that identify the resource that the website display
//product/avocado or id=avocado
//*LOCAL MODULES
const replaceTemplate = require("./modules/replaceTemplate");

//!Blocking, synchronous way

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

//!SERVER

//SECOND STEP
//WE put in the top level so this is gonna execute only once
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

//SLUGS
const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
//!CREATE A SERVER
//?req=request
//?res=response, send out to the client a response

const server = http.createServer((req, res) => {
  const baseURL = `http://${req.headers.host}`;
  //http://localhost:8000
  const requestURL = new URL(req.url, baseURL);
  //URL OBJECT
  const pathname = requestURL.pathname;
  // /product
  const query = requestURL.searchParams.get("id");
  //is the id of the product

  //!OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardHtml = dataObject.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    // console.log(cardHtml)
    res.end(output);

    //!PRODUCT PAGE
  } else if (pathname === "/product") {
    const product = dataObject[query];
    // console.log(product)
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //!API PAGE
  } else if (pathname === "/api") {
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

    //!404 NOT FOUND PAGE
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1>no no no no</h1>");
  }
  // console.log(req.url);
  // res.end('Hi from the server')
});

//LISTEN TO THE SERVER

//arguments = 1-port ,2-host (localhost in this case)
server.listen(8000, "127.0.0.1", () => {
  console.log("Listened to request on port 8000");
});
