window.onload = function(){ 
let codeplace = document.getElementById("code")

let upbutton = document.getElementById("upb")

let dbutton = document.getElementById("downb")

console.log("Script included.")
upbutton.onclick = function(){
   
}
dbutton.onclick =function(){
   window.location = "/download/"+codeplace.value
}


}
