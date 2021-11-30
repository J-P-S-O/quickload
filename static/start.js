window.onload = function(){ 

let upbutton = document.getElementById("upb")
let dbutton = document.getElementById("downb")
let frame = document.getElementById("frame")
console.log("Script included.")
upbutton.onclick = function(){
    if (frame.src != "uploadframe.html") frame.src = "uploadframe.html";
    window.document.title = "Upload something"
}
dbutton.onclick =function(){
    if (frame.src != "downframe.html") frame.src = "downframe.html"
    window.document.title = "Download something"
}
}