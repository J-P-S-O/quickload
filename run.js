let prompt = require("prompt-sync")()
let chalk = import("chalk")
let path = require("path")
let fs = require("fs")
let log = console.log;
let http = require("http")
let crypto = require("crypto")

if (fs.existsSync("data")) { 
    console.log("\x1b[31m WARNING: Folder \"data\" will be erased and rebuilt if you proceed \x1b[37m")
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

fs.mkdirSync("./data");
fs.mkdirSync("./data/keys")

const requestListener = function (req, res) {
  if (req.url!=="/favicon.ico") log(req.url)
  if (req.url === "/test"){
  fs.readFile("templates/rick.html", function (err,data) {
      if (err) {
        res.writeHead(203);
        res.end("<html><body><b>internal error</b></body></html>"+JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }else if (req.url === "/"){
    fs.readFile("templates/start.html", function (err,data) {
      if (err) {
        res.writeHead(203);
        res.end("<html><body><b>internal error</b></body></html>"+JSON.stringify(err));
        return;
      }
      let upc = crypto.randomBytes(16).toString("base64")
      let dc = crypto.randomBytes(16).toString("base64")
      
      data = data.toString().replace("\\\\code2",dc) // error lol
      data = data.toString().replace("\\\\code",upc)
      log(dc)
      log(upc)
      fs.writeFileSync
      res.writeHead(200);
      res.end(data);
    });
  }else if(req.url.includes("/../")) {
    fs.readFile("templates/500.html", function (err,data) {
      if (err) {
        res.writeHead(203);
        res.end("<html><body><b>internal error</b></body></html>"+JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });

  } else {
    fs.readFile("static" + req.url, function (err,data) {
      if (err) {
        
        if(err.code=="ENOENT"){
          
          fs.readFile("templates/404.html", function (err,data) {
            if (err) {
              res.writeHead(203);
              res.end("<html><body><b>internal error</b></body></html>"+JSON.stringify(err));
              return;
            }
            
            res.writeHead(404);
            res.end(data);
            return;
          })
          return;
        }

        res.writeHead(203);
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
