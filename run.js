const prompt = require("prompt-sync")
const chalk = require("chalk")
const path = require('path');
const warn = function(message, color){
  if (!color) color = red
  console.log(chalk[color](message))
}


if (path.existsSync("/data")) { // or fs.existsSync
    warn("WARNING: Folder \"data\" will be erased and rebuilt if you proceed")
    const answer = prompt("Would you like to proceed? (S/N)")
    if (String(answer).toUpperCase=="S"){
      //delete
      console.log("Done")
    } else if (String(answer).toUpperCase=="N"){
      console.log("Goodbye!")
      exit(0)
    }else{
      warn("Not a valid answer. Exiting...")
      exit(1)
    }
}
