var listWords = document.body.innerText.split(/ |\n/).filter(function (word){return word.length})

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.content) {
        console.log(request);
        var text = processPageText();
		var links = linksPro();
		var favIconUrl = document.querySelector("link[rel*='icon']").href;
		sendResponse({content: text, links:links, favIcon: favIconUrl});
		return true; // This is required by a Chrome Extension
	}
})



var dictArrays = []
// all the different dictionaries referenced by their respective ids





// Gets all the content on the page
var linksPro = function() {
	var links = [];
	var html_list = document.getElementsByTagName('a');
	for (var i=0; i<html_list.length;i++){
	if(html_list[i].getAttribute('href') && html_list[i].innerText){links.push(html_list[i].innerText)}
	}
	return links;
}


function processPageText() {
    var everything = document.body.textContent.toLowerCase();//
    return everything;
}

document.addEventListener('click', function(clickEvent){
	console.log(clickEvent)
	console.log("text :",clickEvent.path[0].innerText);
	var clickObj = {
		text : clickEvent.path[0].innerText
	};
	var pathLen = clickEvent.path.length;
	for (var j = 0; j<pathLen; j++){
		if (clickEvent.path[j].href != undefined){
			clickObj.link=clickEvent.path[j].href;
		}
	}

    chrome.runtime.sendMessage({click: clickObj}, function(response) {
      console.log(response.farewell);
    });
}, true);


// ADDS an overlay

//document.body.innerHTML += '<div style="position: fixed;width: 600px;height: 200px;left: 50%;top: 0%;margin-left: -300px; /*half the width*/opacity:0.3;z-index:100;color:#000;"><div> CLICK ME  </div></div>';
