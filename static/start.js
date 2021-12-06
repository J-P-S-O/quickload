window.onload = function(){ 
let codeplace = document.getElementById("code")

let upbutton = document.getElementById("fileupload")

let dbutton = document.getElementById("downb")
console.log(upbutton)

console.log("Script included.")
upbutton.onchange = function(e){
   var file = upbutton.files[0];
		
	var reader = new FileReader();

				reader.onload = function(e) {
					console.log(reader.result)
               console.log(file.type)
               console.log(file.name)
               let xhr = new XMLHttpRequest()
               xhr.open('POST', '/upload')
               xhr.setRequestHeader('Content-Type', file.type);
               xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
               xhr.send(reader.result)
               xhr.onload = () => {
                  window.alert(xhr.responseText);

               }
				}

				reader.readAsBinaryString(file);	

			
			
   
}
dbutton.onclick =function(){
   let xhr = new XMLHttpRequest()
               xhr.open('GET', "/download/"+codeplace.value)
              
               xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
               xhr.send()
               xhr.onload = () => {
                  console.log("Status: " +xhr.status)
                  console.log("Response: "+xhr.response)
                  console.log("ResponseText: "+xhr.responseText)
                  console.log("Type: "+xhr.responseType)
                  
                  window.location = xhr.responseText;

               }
   
}


}
