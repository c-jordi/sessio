// Variables that determine the Filters

var filteredSites = [];
var timeThresh = 1000; //in ms, if the website is opened for less time, it wont be part of a session, this value is modifiable

var idObject = {};
function nomenclatureId(nodeEvent) {
    // Assigns a unique identifier as a string for every event -- This one works for branching
    // Events need to be passed in a chronological order

    var currentId = nodeEvent.id;
    var newID = "";
    if (idObject[currentId]== undefined){
        idObject[currentId] = [{time : Date.now(), id:"0", url : "The id count has been restarted"}];
    }
    // If the tab was closed
    if (nodeEvent.status == "Removed"){
        var maxGen = 0;
        idObject[currentId].forEach( function(e) {
            var arr = e.id.split("-");;
            if (maxGen < Number(arr[0])){
                maxGen = Number(arr[0]);
            }
        });
        newID = (maxGen+1).toString();
        nodeEvent.url = "New Generation - " + newID;
    }
    else if (nodeEvent.status == "Completed" && nodeEvent.openerTabId == undefined) {

        // CHECKING IF THE USER HAS GONE BACK TO VISIT AN OLD PAGE

        var lastItem = idObject[currentId].length -1;
        var lastItemId = idObject[currentId][lastItem].id;
        var stringArray = lastItemId.split("-");
        var startingId = stringArray.shift();
        var allTabStrings = [];
        idObject[currentId].forEach(function(item){
            allTabStrings.push(item.id);
        });
        var stringIndex = -1;
        var matchingString = false;

        for (var i= stringArray.length-1; i >0 ; i=i-1) {
            var id_string = startingId ;
            for (var j=0; j < i ; j++){
                id_string = id_string + '-' + stringArray[j];
            }
            stringIndex = allTabStrings.indexOf(id_string);
            if (idObject[currentId][stringIndex].url == nodeEvent.url){
                matchingString = true;
                break;
            }
        }

        if (matchingString) {
            newID =  idObject[currentId][stringIndex].id;
        }
        else {
            //lastItem   -> length
            //lastItemId  -> last item full id

            var maxBranch = 0;
            var nextBranchFound = false;
            allTabStrings.forEach( function(item,index) {
                // To know what the max branch number
                var tempString = item.slice(lastItem+1,lastItem+6);
                var tempArray = tempString.split('-');
                var branchNb = tempArray[0];
                if (branchNb != ""){
                    var branchInt = Number(branchNb);
                    if (branchInt>maxBranch){
                        maxBranch = branchInt;
                    }
                }
            });
            // To see if one of the branches has already visited the site
            for (var j = 0; j < maxBranch + 1; j++) {
                var stringTest = lastItemId + '-' + j;
                var indexLocated = allTabStrings.indexOf(stringTest);
                if (idObject[currentId][indexLocated].url == nodeEvent.url) {
                    nextBranchFound = true;
                    newID = stringTest;
                }
            }
            if (nextBranchFound == false){
                newID = lastItemId + '-' + (maxBranch+1);
            }
        }
    }
    else if (nodeEvent.status == "Completed" && nodeEvent.openerTabId != undefined) {
        // Check if there is a closing generation event
        var maxGen = 0;
        idObject[currentId].forEach( function(e) {
            var arr = e.id.split("-");;
            if (maxGen < Number(arr[0])){
                maxGen = Number(arr[0]);
            }
        });
        var stringNewGen = maxGen.toString();
        var GenerationUsed = false;
        idObject[currentId].forEach(function(item){
            var idDecomp = item.id.split('-');
            if (idDecomp[0] == maxGen.toString()){
                if !(idDecomp[1] == "" || idDecomp[1] == undefined) {
                    GenerationUsed = true;
                }
            }
        });
        if (GenerationUsed) {
            newID = (maxGen+1) + '-' + 0;
        }
        else {
            newID = (maxGen) + '-' + 0;
        }
        var openerTabId = nodeEvent.openerTabId;
        var lengthOpenerList = idObject[openerTabId].length-1;
        var openerIdString = idObject[openerTabId][lengthOpenerList].id;

        nodeEvent.openerTabId = openerIdString;
    }
    nodeEvent.id = newID;
    idObject[currentId].push({time : Date.now(), id:newID, url : nodeEvent.url})
}




function assignNodeId(nodeEvent) {
    // Assigns a unique identifier for every event
    // Events need to be passed in a chronological order
    var currentId = nodeEvent.id;

    if (idObject[currentId]== undefined){
        idObject[currentId] = [{time : Date.now(), gen : 0, count : 0, branch: 0, alt : "The id count has been restarted"}];
    }
    var lastIndex = idObject[currentId].length -1;

    // Find the generation and count values we need to assign it

    if (nodeEvent.status == "Removed"){
        var currentGen = idObject[currentId][lastIndex].gen + 1;
        var currentCount = 0;
    }
    else if (nodeEvent.status == "Completed" && nodeEvent.openerTabId == undefined) {
        // These are the tabs that have been opened in the same window
        var sitesVisitedLength = sitesVisites[currentId].length -1;
        var beforeLastUrl= sitesVisited[currentId][sitesVisitedLength-1];
        if (beforeLastUrl == nodeEvent.url){
            var currentBranch = idObject[currentId][lastIndex-1].branch;
            var currentGen = idObject[currentId][lastIndex].gen + 1;
            var currentCount = idObject[currentId][lastIndex].count-1;
        }
        else {
            var currentGen = idObject[currentId][lastIndex].gen;
            var currentCount = idObject[currentId][lastIndex].count+1;
            var currentBranch = 0;
            idObject[currentId].forEach(function (e) {
                if (e.gen == currentGen && e.count == currentCount) {
                    currentBranch ++;
                }
            });

            if (countPresent> 0){
                var branchNumber =
            }
        }
    }
    else if (nodeEvent.status == "Completed" && nodeEvent.openerTabId != undefined) {
        // These are the pages that have been opened in a new tab

        if (idObject[currentId][lastIndex].count == 0) {
            var currentGen = idObject[currentId][lastIndex].gen;
            var currentCount = 1;
        }
        else if (idObject[currentId]==undefined){
            var currentGen = 1;
            var currentCount = 1;
        }
        else if (idObject[currentId].count !=0 && idObject[currentId] != undefined){
            var currentGen = idObject[currentId][lastIndex].gen+1;
            var currentCount = 1;
        }
        var openerId = nodeEvent.openerTabId;
        var openerGen = idObject[openerId][idObject[openerId].length-1].gen;
        var openerCount = idObject[openerId][idObject[openerId].length-1].count;
        var openerObj = {openerTabId: openerId, gen: openerGen, count: openerCount};
        nodeEvent.openerTabId = openerObj;
    }
    var objectID = {tabId: currentId, gen: currentGen, count: currentCount};
    nodeEvent.id = objectId;
    idObject[currentId].push({date: nodeEvent.timeStamp, gen: currentGen, count: currentCount, alt:nodeEvent.title});
}





function siteFilters (Obj) {
    // Sites that will not appear in the Sessions
        // eg: Facebook, Twitter, Emails
        // Search can be done by using the url (a string) or title
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
