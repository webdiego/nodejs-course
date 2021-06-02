const fs = require("fs");

const server = require("http").createServer();
server.on('request',(req,res)=>{
  //!Solution 1 - only for small task - we read and write all the data
  // fs.readFile('./test-file.txt',(err,data)=>{
  //   if(err) console.log(err)
  //   res.end(data)
  // })

  //!Solution 2 - we chunk in little piece and send them not waiting the all file is read and write

  //? a problem that we can face with this solution is the "back pressure "that means that the server is not able to send the data as fast it receive it

  // const readable = fs.createReadStream('./test-file.txt')
  // readable.on('data', (chunk)=>{
  //  res.write(chunk)
  // })
  // readable.on('end',()=>{
  //   res.end()
  // })
  // readable.on('error', err =>{
  //   console.log(err)
  //   res.statusCode = 500 
  //   res.end('file not found')
  // })

  //!Solution 3 - pipe -
  //?Meaning
  //readableSource.pipe(writeableDestination)

  const readable = fs.createReadStream('./test-file.txt')
  readable.pipe(res)

})

server.listen(8000, '127.0.0.1',()=>{
  console.log('Listening')
})