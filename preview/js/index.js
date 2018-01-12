
window.addEventListener('mouseover', function(){
    chrome.runtime.sendMessage({fn: "highPreview"})
})

document.getElementById("overlayWind").addEventListener('click',closeOverlay);
document.getElementById("qr-code").addEventListener('click',openOverlay);

var sessionTitle = document.getElementById("title");
var sessionDate = document.getElementById("date");
var sessionDesc = document.getElementById("desc");



var examples = [];
function loadExamples(){

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            //console.log("The config file has been loaded", JSON.parse(xhr.response));
            examples.push(JSON.parse(xhr.response));
            console.log(JSON.parse(xhr.response));
            drawGraph(JSON.parse(xhr.response));
            updateDisplay(JSON.parse(xhr.response));
        }
    }
    xhr.open("GET", chrome.extension.getURL("../examples/session1.json"),true);
    xhr.send();


}
loadExamples();
console.log("loaded the Examples", examples);

function updateDisplay(graph){
    sessionTitle.innerText= graph.title.toUpperCase();
    sessionDate.innerText = graph.date.start + ' - ' + graph.date.end;
    sessionDesc.innerText = graph.desc;

}



function openOverlay(){
     document.getElementById("overlayWind").style.height = "100%";
}

function closeOverlay(){
    document.getElementById("overlayWind").style.height = "0%";
}
