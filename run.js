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
  
}

const server = http.createServer(requestListener);
log("Server created. Starting...")
server.listen(80);
