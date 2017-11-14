// Variables that determine the Filters

var filteredSites = [];
var timeThresh = 1000; //in ms, if the website is opened for less time, it wont be part of a session, this value is modifiable
var idObject = {};



function assignNodeId(nodeEvent) {
    // Assigns a unique identifier for every event
    // Events need to be passed in a chronological order
    currentId = nodeEvent.id;

    if (!idObject[currentId]){
        idObject[currentId] = [{time : Date.now(), gen : 0, count : 0, alt : "The id count has been restarted"}];
    }
    insertionIndex = idObject.currentId.length;


    // Find the generation and count values we need to assign it

    if (nodeEvent.status == "close"){
        var currentGen = idObject.currentId[insertionIndex].gen + 1;
        var currentCount = 0;

    }
    else if (nodeEvent.status == "parent") {
        var currentGen = idObject.currentId[insertionIndex].gen;
        var currentCount = idObject.currentId[insertionIndex].count+1;
    }
    else if (nodeEvent.status == "child") {
        if (idObject.currentId[insertionIndex].count == 0) {
            var currentGen = idObject.currentId[insertionIndex].gen;
            var currentCount = idObject.currentId[insertionIndex].count+1;
        }
        else {
            var currentGen = idObject.currentId[insertionIndex].gen+1;
            var currentCount = 1;
        }
        var openerId = nodeEvent.openerTabId;
        var openerGen = idObject.openerId[idObject.openerId.length -1].gen;
        var openerCount = idObject.openerId[idObject.openerId.length -1].count;
        var openerObj = {openerTabId: openerId, gen: openerGen, count: openerCount};
        nodeEvent.openerTabId = openerObj;
    }
    var objectID = {tabId: currentId, gen: currentGen, count: currentCount};
    nodeEvent.id = objectId;
    idObject.currentId.push({date: nodeEvent.timeStamp, gen: currentGen, count: currentCount, alt:nodeEvent.title});
}




// Sites that will not appear in the Sessions
    // eg: Facebook, Twitter, Emails
    // Search can be done by using the url (a string) or title
function siteFilters (Obj) {
    Obj.forEach(function(page){
        for (var site in filteredSites) {
            if (page.title.toLowerCase().includes(site.toLowerCase() ) || page.url.toLowerCase().includes(site.toLowerCase() )){
                var index = Obj.indexOf(page);
                Obj.splice(index,1);
            }
        }
    }
}



function session(){
    this.title = "";
    this.desc = "";
    this.date = {start: "", end: ""};
    this.nodes = []; // Every Node has a description
    this.links = []; // Contains the sessionLink Object


    // Methods
    this.size = function (){
        var length= this.nodes.length;
        return length;
    }
}


function sessionLink(a,b,text) {
    // a is the origin of the line
    // b is the end point of the line
    // text is the description that goes on the line
    this.a = a;
    this.b = b;
    this.text = text;
}

function sessionOrganizer() {

}


// This function allows to get the innerText or innerHtml of the link that
// clicked to open the child windows

function searchChildLink(pageObj) {
    pageObj.forEach( function(page){
        if (page.status == "child") {
            var openerId = page.openerTabId;
            var listIndex = pageObj.indexOf(page);
            var found = false;
            for (var i = 1; i < listIndex; i++) {
                if (pageObj[listIndex-i].id == openerId && found == false) {
                    found = true;
                    var url = page.Obj[listIndex-i].url;
                    document.querySelectorAll('[href]');
                    temp1.forEach(function (page) {
	                    if (page.href == "https://www.w3schools.com/howto/howto_js_sort_list.asp"){
		                console.log(page.innerText);
	}
})
                }
                chrome.tabs.executeScript(integer tabId, object details, function callback)

            }
        }
    });
}
