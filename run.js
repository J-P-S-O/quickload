let prompt = require("prompt-sync")()
let chalk = import("chalk")
let path = require("path")
let fs = require("fs")
let log = console.log;
let http = require("http")

if (fs.existsSync("data")) { 
    console.log("WARNING: Folder \"data\" will be erased and rebuilt if you proceed")
    const answer = prompt("Would you like to proceed? (S/N)")
    if (answer.toUpperCase() =="S"){
      log("removing")
      fs.rmdirSync("data",{recursive: true})
      console.log("Done!")
      console.log("Now we can start the HTTP server lol")
      
    } else if (answer.toUpperCase() =="N"){
      console.log("Goodbye!")
      process.exit(0)
    }else{
      console.log("Not a valid answer. Exiting...")
      process.exit(1)
    }
}

const requestListener = function (req, res) {
  log(req.url)
  if (req.url === "/test"){
  fs.readFile("templates/rick.html", function (err,data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }else if (req.url === "/"){
         
  }else {
    fs.readFile("static" + req.url, function (err,data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }
}

const server = http.createServer(requestListener);
log("Server created. Starting...")
server.listen(80);
