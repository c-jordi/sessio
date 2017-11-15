console.log('background loaded!');

// DECLARING Variables
var nodes = []
var edges = []
var pageCount = {}

var globalDict = {};
function retrieveGlobalDict () {
var Objec ={};
    chrome.storage.local.get(function(storedObj) {
      if(typeof(storedObj["globalDict"]) !== 'undefined' && storedObj["globalDict"] instanceof Array) {
        console.log("Response", storedObj);
        Objec = storedObj["globalDict"];

      } else {
        storedObj["globalDict"] = {addedIds: [], dict: {}};
        chrome.storage.local.set(storedObj);
        Objec = storedObj["globalDict"];
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

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {

  if (change.status == "complete") {
    console.log('onUpdated', tabId, change, tab);
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

    chrome.tabs.sendMessage(tabId, {content: "Gather the page text"}, function(response) {
 	    if(response) {
 		    var text = response.content.split(/\W+/);
            text.forEach( function (item, index, object) {
                var indexOf = words100.indexOf(item);
                if (word10000[item]==undefined || indexOf <0){
                    object.splice(index, 1);
                }
            })

            console.log("at this step");
            saveObj.id = namingID(saveObj);
            var dictio = new textAnalysis(text,saveObj.id);
            console.log("Dictio 1: ", dictio);
            dictio.createDict();
            console.log("Dictio 2: ", dictio);
            dictio.updateGlobal();
            console.log("globaldict", globalDict);
            dictio.countSort();
            console.log("Keys :", dictio.keys);
            var ar2 = dictio.keys.slice(0, 5);
            console.log("Main Words: ",ar2);

 	    }
    });

    console.log(saveObj);
    pushNewPage(saveObj);
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
    } else {
      storedObj["pages"] = [pageObj];
    }
    chrome.storage.local.set(storedObj);
  });
}

function textAnalysis(words, identifier) {
    this.dict = {};
    this.keys = [];
    this.id = identifier;

    this.createDict = function(){
        for (var i; i< words.length;i++){
            if (validate(words[i])){

                var word = words[i];
                console.log("word: ", word);
                if (this.dict[word] == undefined) {
                  this.dict[word] = {};
                  this.dict[word].count = 1;
                  this.dict[word].word = word;
                  this.keys.push(word);
                } else {
                  this.dict[word].count++;
                }
            }
        }
    }
    // Get count for a specific Word
    this.getCount = function(word) {
      return this.dict[word].count;
    }


    this.updateGlobal = function() {

        var entryAdded = false;

        globalDict.addedIds.forEach( function (e) {
            if (e==this.id) {entryAdded = true};
        })


        if (entryAdded == false) {
            globalDict.addedIds.push(this.id);
            for (var i; i< words.length;i++){
                if (validate(words[i])){
                    var word = words[i];
                    var wordAdded = false;
                    console.log("word:", word);
                    if (globalDict.dict[word] == undefined) {
                        globalDict.dict[word] = {};
                        globalDict.dict[word].ids = [];
                    }
                    globalDict.dict[word].ids.forEach( function(e) {
                        if (e == this.id) {
                            wordAdded = true
                        };
                    });
                if (wordAdded == false) {globalDict.dict[word].ids.push(this.id)}
                }
            }
        }
        updateGlobalDict(globalDict);
    }

    this.countSort = function() {
      this.keys.sort(function(a, b) {
        return (this.getCount(b) - this.getCount(a));
      });
    }
}





function updateGlobalDict(globalDict){
    chrome.storage.local.get(function(storedObj) {
        storedObj["globalDict"]=globalDict;
        chrome.storage.local.set(storedObj);
    });
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

// This Class will allow us to keep track of the word count
/*
class TFIDF {
  constructor() {
    this.dict = {};
    this.keys = [];
    this.totalwords = 0;
  }

  // Count the words
  termFreq(tokens) {
    // For every token
    for (var i = 0; i < tokens.length; i++) {
      // Lowercase everything to ignore case
      var token = tokens[i].toLowerCase();
      if (validate(token)) {
        this.increment(token);
        this.totalwords++;
      }
    }
  }



  // Get all the keys
  getKeys() {
    return this.keys;
  }

  // Get the count for one word
  getCount(word) {
    return this.dict[word].count;
  }

  // Get the score for one word
  getScore(word) {
    return this.dict[word].tfidf;
  }

  // Increment the count for one word
  increment(word) {
    // Is this a new word?
    if (this.dict[word] == undefined) {
      this.dict[word] = {};
      this.dict[word].count = 1;
      this.dict[word].docCount = 0;
      this.dict[word].word = word;
      this.keys.push(word);
      // Otherwise just increment its count
    } else {
      this.dict[word].count++;
    }

    // Adding to the global dictionnary

    if (globalDict.dict[word] == undefined) {
        globalDict.dict[word] = {};
        globalDict.dict[word].ids = [];
    }

    var entryAdded = false;
    globalDict.addedIds.forEach(function(id){
        if (id == this.id) {
            entryAdded = true;
            break;
        }
    })

    if (entryAdded == false) {
        var wordAdded = false;
        for (var i=0; i< globalDict.dict[word].ids.length; i++){
            if (globalDict.dict[word].ids[i] == this.id) {
                added = true;
            }
        }
        if (added == false) {globalDict.dict[word].ids.push(this.id)}
    }
  }

  // Finish and calculate everything
  finish(totaldocs) {
    // calculate tf-idf score
    for (var i = 0; i < this.keys.length; i++) {
      var key = this.keys[i];
      var word = this.dict[key];
      var tf = word.count / this.totalwords;
      // See:
      var idf = log(totaldocs / globalDict.dict[word].ids.length);
      word.tfidf = tf * idf;
    }
  }

  // Sort by word counts
  sortByCount() {
    // A fancy way to sort each element
    // Compare the counts
    this.keys.sort(function(a, b) {
      return (this.getCount(b) - this.getCount(a));
    });
  }

  // Sort by TFIDF score
  sortByScore() {
    // A fancy way to sort each element
    // Compare the counts
    this.keys.sort(function(a, b) {
      return (this.getScore(b) - this.getScore(a));
    });
  }
}

function UpdateScore() {


}

function SortByScore() {


}

function processText(text) {
  var tfidf = new TFIDF;
  // Process this data into the tfidf object
  tfidf.termFreq(text);

  // Now we need to read all the rest of the files
  // for document occurences
  for (var i = 0; i < files.length; i++) {
    tfidf.docFreq(files[i].data);
  }
  tfidf.finish(globalDict.addedIds.length);
  tfidf.sortByScore();

}
