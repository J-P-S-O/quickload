let upb = document.getElementById("upb")
let db = document.getElementById("downb")
let frame = document.getElementById("frame")

upb.onclick(function(){
    if (frame.src != "uploadframe.html") frame.src = "uploadframe.html";
})
db.onclick(function(){
    if (frame.src != "downframe.html") frame.src = "downframe.html"
})