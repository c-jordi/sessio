console.log('background loaded!');

// DECLARING Variables
var nodes = []
var edges = []
var pageCount = {}

var globalDict = {};
function retrieveGlobalDict () {
var Objec ={};
    chrome.storage.local.get('globalDict', function(storedObj) {

      if(typeof(storedObj) !== 'undefined' && storedObj.addedIds != undefined && storedObj.dict != undefined) {
        console.log("Successful Load", storedObj);
        Objec = storedObj;


      } else {
        console.log("Unsuccessful Load");
        Objec= {addedIds: [], dict: {}};
        chrome.storage.local.set({globalDict: Objec});
        console.log("Objec ", Objec);
      }
      globalDict = Objec;
    });

}
retrieveGlobalDict ()

function namingID(page) {
    if (pageCount[page.id] != undefined) {
      pageCount[page.id] = pageCount[page.id] + 1;
    } else {
      pageCount[page.id] = 0;
    }

    var dup = JSON.parse(JSON.stringify(page))
    dup.id = page.id + '-' + pageCount[page.id]
    return dup.id;
}

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    console.log("message: ", message, " sender: ", sender)
    sendResponse({farewell:"goodbye"});
});

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {

  if (change.status == "complete") {
    //console.log('onUpdated', tabId, change, tab);
    var saveObj = {
      id : tab.id,
      status : "Completed",
      favIconUrl : tab.favIconUrl,
      openerTabId : tab.openerTabId,
      timeStamp : Date.now(),
      title : tab.title,
      url : tab.url,
      incognito : tab.incognito,
      active : tab.active
    }
    var text = "";
    chrome.tabs.sendMessage(tabId, {content: "Gather the page text"}, function(response) {
 	    if(response) {
            var keptText= [];
 		    text = response.content.split(/\W+/);
            text.forEach( function (item, index, object) {
                var indexOf = words100list.indexOf(item);
                if (word10000[item]!=undefined && indexOf <0 && (hasNumbers(item)==false)) { //
                    keptText.push(item);
                }
            })

            // ALSO SPLICE STRINGS OF NUMBERS
            // AND LIMIT THE TOTAL SIZE

            saveObj.id = namingID(saveObj);
            var dictio = new textAnalysis(keptText,saveObj.id);

            dictio.createDict();
            console.log("Diction node: ", dictio);
            dictio.updateGlobal();
            //console.log("Global dict", globalDict);
            //dictio.countSort();

            calculateScore(dictio.keys,dictio.dict);
            scoreSort(dictio.keys,dictio.dict);
            var ar2 = dictio.keys.slice(0, 4);
            console.log("Main Words: ",ar2);



            ar2.forEach( function(e) {
                console.log("Word: ", e, " Score :", dictio.dict[e].score, "Count :", dictio.dict[e].count)

            })

            pushNewPage(saveObj);
 	    }
    });
  }
});

chrome.tabs.onRemoved.addListener(function (tabId, info) {
    console.log('onRemoved', tabId, info);
    var saveObj = {
        id : tabId,
        status : "Removed",
        timeStamp : Date.now()
    }
    console.log("The OBJECT:",saveObj);

    pushNewPage(saveObj);
});



function saveChanges(key, pageNode) {
  if (!pageNode) {
    console.log('Error: No value specified');
    return;
  }
  var obj = {}
  obj[key] = pageNode
  chrome.storage.sync.set(obj, function() {
    console.log('Page saved');
  });
}

function pushNewPage(pageObj) {
  chrome.storage.local.get(function(storedObj) {
    if(typeof(storedObj["pages"]) !== 'undefined' && storedObj["pages"] instanceof Array) {
      storedObj["pages"].push(pageObj);
      storedObj["globalDict"] = globalDict;
    } else {
      storedObj["pages"] = [pageObj];
      storedObj["globalDict"] = globalDict;
    }
    chrome.storage.local.set(storedObj);
  });
}

function textAnalysis(words, identifier) {
    this.dict = {};
    this.keys = [];
    this.id = identifier;
    this.words = words;
    var _this= this; // change to var _this

    this.createDict = function(){
        var dict = _this.dict;
        var keys = _this.keys;
        this.words.forEach( function(word){
            if (validate(word)){
                if (dict[word] == undefined) {
                  dict[word] = {};
                  dict[word].count = 1;
                  dict[word].word = word;
                  keys.push(word);
                } else {
                  dict[word].count++;
                }
            }
        });
    }

    this.updateGlobal = function() {

        var entryAdded = false;
        globalDict.addedIds.forEach( function (e) {
            if (e==_this.id) {entryAdded = true};
        })


        if (entryAdded == false) {
            globalDict.addedIds.push(_this.id);
            _this.words.forEach ( function(word) {
                if (validate(word)){
                    var wordAdded = false;
                    if (globalDict.dict[word] == undefined) {
                        globalDict.dict[word] = {};
                        globalDict.dict[word].ids = [];
                    }
                    globalDict.dict[word].ids.forEach( function(e) {
                        if (e == _this.id) {
                            wordAdded = true
                        };
                    });
                    if (wordAdded == false) {globalDict.dict[word].ids.push(_this.id)}
                }
            });
        }
        //updateGlobalDict(globalDict);
    }

    this.getCount = function(word) {
      return _this.dict[word].count;
    }

    this.countSort = function() {
      _this.keys.sort(function(a, b) {
        return (_this.getCount(b) - _this.getCount(a));
      });
    }
}

function calculateScore(keys,dict) {
    keys.forEach( function(word) {
        var entry = dict[word];
        var tf = entry.count // I havent normalized by dividing by whole number of number of words, its not going to change the ranking, however I wont be able to compare these scores with the scores of other pages
        var idf = Math.log(globalDict.addedIds.length / globalDict.dict[word].ids.length);
        entry.score = tf * idf;
    });
}

function getScore(word,dict) {
    return dict[word].score;
}

function scoreSort(keys,dict) {
    keys.sort(function(a,b) {
        return (getScore(b,dict) - getScore(a,dict))
    });
}





function updateGlobalDict(globalDict){
    chrome.storage.local.get(function(storedObj) {
        console.log('store dic:', storedObj.globalDict);
        console.log('global dict: ', globalDict);
        storedObj.globalDict=globalDict;
        console.log('new to store',storedObj);

        console.log("done Storage");

    });
    chrome.storage.local.set(storedObj);
}

chrome.browserAction.onClicked.addListener(function (tab) {
  console.log('browserAction', tab);
  chrome.tabs.create({'url': "/public/index.html" });
})


////// Functions to Process the Incoming text



// A function to tokenize
function tokenize(text) {
    var arrayText = text.split(/\W+/);
    return arrayText;
}


// A function to validate a token
function validate(token) {
    return /\w{2,}/.test(token);
}

function hasNumbers(t) {
    return /\d/.test(t);
}
