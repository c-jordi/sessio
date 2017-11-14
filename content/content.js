var listWords = document.body.innerText.split(/ |\n/).filter(function (word){return word.length})

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.content) {
        console.log(request);
        var text = processPageText();
		sendResponse({content: text});
		return true; // This is required by a Chrome Extension
	}
})



var dictArrays = []
// all the different dictionaries referenced by their respective ids





// Gets all the content on the page
function processPageText() {
    var everything = document.body.textContent.toLowerCase();//
    return everything;
}
