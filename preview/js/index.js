
window.addEventListener('mouseover', function(){
    chrome.runtime.sendMessage({fn: "highPreview"})
})



var examples = [];
function loadExamples(){

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            //console.log("The config file has been loaded", JSON.parse(xhr.response));
            examples.push(JSON.parse(xhr.response));
            console.log(JSON.parse(xhr.response));
            drawGraph(JSON.parse(xhr.response));
        }
    }
    xhr.open("GET", chrome.extension.getURL("../examples/session1.json"),true);
    xhr.send();
}
loadExamples();
console.log("loaded the Examples", examples);
