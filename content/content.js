var listWords = document.body.innerText.split(/ |\n/).filter(function (word){return word.length})

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.content) {
        console.log(request);
        var text = processPageText();
		sendResponse({content: text});
		return true; // This is required by a Chrome Extension
	}
})

var globalDict = {addedIds:[],dict:{}};
// word:    df:

var dictArrays = []
// all the different dictionaries referenced by their respective ids

var data = "" //Is the list of words taken from everysingle webpage


var files = [];

// Gets all the content on the page
function processPageText() {
    var everything = document.body.textContent.toLowerCase();//
    return everything;
}
