/* 
Code source: https://github.com/J-P-S-O/quickload
THIS CODE IS EXPERIMENTAL AND HAS NO WARRANTS RELATED TO SAFETY AND RELIABILITY.
With love,
- @J-P-S-O (Octopus)
*/



let prompt = require("prompt-sync")()
let fs = require("fs")
let log = console.log;
let http = require("http")
let crypto = require("crypto")
const { isText } = require('istextorbinary')




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
      
    
      intcode = "./data/keys/" + intcode
      fs.writeFileSync(intcode,body)
    
      
      /*fs.readFile(intcode, 'utf8', function(err, data){

    if (err){ throw err; }
    var lines = data.split('\n')
    var type = lines[2]
    type = type.replace("Content-Type: ","")
    //log(type)
    
    lines = lines.slice(3).join('\n');
    lines = lines.split("\n")
    let i = 0
    while (i < 6){
      
    lines.splice(-1)
    i++
    }
    lines = lines.join('\n')
    //console.log(lines)
    /* fs.writeFileSync(intcode, lines); */
    //fs.writeFileSync(intcode+".type",type)
    
console.log("File uploaded to "+"\x1b[32m"+intcode.replace("./data/keys/","")+"\x1b[37m" +" Type: " /*+ type*/)
    
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
    //log(String(req.url).replace("/download/",""))
    let pathh = (String(req.url).replace("/download/",""))
    pathh = "./data/keys/" + pathh + ".type"
    fs.readFile("./data/keys/" + String(req.url).replace("/download/",""), function (err,data) {
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
      res.setHeader("Content-Type", pathh)
      res.writeHead(200);
      
      res.end(data);
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
