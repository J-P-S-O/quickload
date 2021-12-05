/* 
Code source: https://github.com/J-P-S-O/quickload
THIS CODE IS EXPERIMENTAL AND HAS NO WARRANTS RELATED TO SAFETY AND RELIABILITY.
With love,
- @J-P-S-O (Octopus)
*/


let mime = require('mime-types')
let prompt = require("prompt-sync")()
let fs = require("fs")
let log = console.log;
let http = require("http")
let crypto = require("crypto")
let path = require("path")



    console.log("\x1b[31m WARNING: All files in /static/ matching \x1b[34m *.upload.* \x1b[31m will be removed \x1b[37m")
    
    const answer = prompt("Would you like to proceed? (S/N)")
    if (answer.toUpperCase() =="S"){
      //log("removing")
      if(fs.existsSync("static")){
        let filess = fs.readdirSync("./static")
        for (file in filess){
        
          //console.log(String(filess[file]))
          if (String(filess[file]).match(/\.*\.upload\.*/)){
            console.log("Removing "+"\x1b[32m"+ String(filess[file]) + "\x1b[37m")
             fs.unlinkSync(path.join(__dirname,"static", filess[file]))
          }
        } 
      }
      console.log("Done!")
      console.log("Now we can start the HTTP server lol")
      
    } else if (answer.toUpperCase() =="N"){
      console.log("Goodbye!")
      process.exit(0)
    }else{
      console.log("Not a valid answer. Exiting...")
      process.exit(1)
    }
    


const requestListener = function (req, res) {
  let intcode = "" + crypto.randomInt(999999);

  if (req.url!=="/favicon.ico") {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    log( String(new Date) + ": " + req.method + " => " + String(req.url) + " => User IP: " + ip)
    
  }
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
      //log(dc)
      //log(upc)
      fs.writeFileSync
      res.writeHead(200);
      res.end(data);
    });
  }else if(String(req.url).split("?")[0]==="/upload"){
    //console.log("upload")
    let body = "";
    req.on("data",(chunk)=>{
      //console.log(String(chunk))
      body += chunk
      
    })
    req.on("end",()=>{
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Success: your code is "+ intcode);
      //console.log(req.headers)
      let type = req.headers["content-type"]
      let ext = mime.extension(type)
    let code = intcode
      intcode = "./static/" + intcode+".upload."+ext
      fs.writeFileSync(intcode,body)
   
      
     
    
console.log("File uploaded to "+"\x1b[32m"+code+"\x1b[37m" +" Type: " + type)
    
/*})*/;


    })

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

  } else if(String(req.url).startsWith("/download/") ){
    let number = String(req.url).replace("/download/","")
    let filepath = new RegExp(number+"\.upload\."+"*")
    let defpath = "undefined"
    let files = fs.readdirSync("static")
    console.log(filepath)
    for (file in files){
      console.log(files[file])
      
      if (String(files[file]).match(filepath)){
        defpath = String(files[file])
        console.log(defpath)
      }
    }
    fs.readFile(defpath, function(err,data) {
      if (err) {
        if(err.code=="ENOENT"){   
            res.writeHead(404);
            res.end(data);
            return;
          }        
        res.writeHead(203);
        res.end(JSON.stringify(err));
        return;
      }
      res.setHeader("Content-Type", "text/plain")
      res.writeHead(200);
      res.end(defpath);
      console.log("File downloaded from "+"\x1b[32m"+String(req.url).replace("/download/","")+"\x1b[37m")
    });
  }else{
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
