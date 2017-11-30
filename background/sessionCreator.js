// Edge Scoring System
console.log("session creator page loaded");
var allEdges = {}; // this object stores all the edges of the tree

        // Example
        //
        //      allEdges = {
        //           tabid : {
        //                path 1 : {
        //                      path2 : {a: path1, b: path 2, text: "" ,  ... },
        //                      path3 : {. .... . .. .. },
        //                      nodeScore :

// the is always the chronological parent node
// For display we will write a function to turn the object into an array

function findEdges () {
    generalObject.pages.forEach(function (e){
        var pathString = e.path,
            lastIndex = pathString.lastIndexOf("-");

        var parentPath = "",
            tabid;

        if (lastIndex >2){
            parentPath = pathString.slice(0,lastIndex);
            tabid = e.id;
        } else if (e.openerid != undefined) {
            parentPath = e.openerpath;
            tabid = e.openerid;
        }
        else {
            parentPath = "none";
        }

        if (parentPath != "none"){
            generalObject.pages.forEach(function (f){
                if (f.id == tabid && f.path == parentPath) {

                        var linkage = new sessionEdge(f,e);

                        if (allEdges[tabid] == undefined) {
                            allEdges[tabid]={},
                            allEdges[tabid][parentPath]={},
                            allEdges[tabid][parentPath][pathString] = linkage;
                        }
                        else if (allEdges[tabid][parentPath] == undefined) {
                            allEdges[tabid][parentPath]={},
                            allEdges[tabid][parentPath][pathString] = linkage;
                        }
                        else {
                            allEdges[tabid][parentPath][pathString] = linkage;
                        }
                }
            })
        }
    })
}




function sessionEdge(node1,node2) {
    this.a = node1;
    this.b = node2;
    this.array = createEdgeArray(node1, node2);
    this.score = 0; // the score goes from 0 to 1
}


function createEdgeArray (node1, node2) {

    // This function is used to build the link array used in the link score
    // We assume that node 1 is the parent

    // 1. Matching main words
    var node2WordLength = node2.mainWords.length;
    var entry1 = 0;
    node1.mainWords.forEach ( function (e, index) {
        for (var i=0; i< node2WordLength; i++){
            if (e.word == node2.mainWords[i].word){
            entry1 += e.score * node2.mainWords[i].score;
            }
        }
    })
    //entry1 = entry1 / node2WordLength;

    // 2. Matching Url root
    var entry2 = 0,
        root1a = node1.url.split(".")[0],
        root1b = node1.url.split(".")[1],
        root2a = node2.url.split(".")[0],
        root2b = node2.url.split(".")[1];

    if (_.includes(root1a,root2a) || _.includes(root2b,root1b) || _.includes(root1b,root2b) || _.includes(root2a,root1a)){
        entry2 = 1;
    }

    // 3. Opener Tab present
    var entry3 = 0;
    if (node2.openerid != undefined) {
        entry3 = 1;
    }

    // 4. Click text
    var entry4 = 0;
    if (node2.clicktext != undefined && node2.clicktext != "") {
        entry4 = 1;
    }
    else {
        entry4 = Math.random(0,1);
    }
    var linkArray= [entry1, entry2, entry3, entry4];

    return linkArray;
}

function edgeScore (edgeArray) {
    // We train a simple 1 hidden layer network to help us make the prediction
    // Ideally the training data should be sent to a firebase database
    // to allow training later on

    // The weight coefficients for the neural network will be downloaded from
    // firebase aswell which will keep them constantly updated

    var score = edgeArray[0]+edgeArray[1]
    return score;
}
/*
function nodeScore () {
    // We start with the objects that have no children and make our way up
    // We use the idObject, pages and allEdges
    var _pages = generalObject.pages,
        _temp = generalObject.pages;

    _pages.forEach( function (e,index) {
        var _path = e.path;

    })
    _pages = _temp;
    var child;
    while (_temp.length != 0){




    }

}*/

function session(){

    this.title = "";
    this.desc = "";
    this.date = {start: "", end: ""};
    this.nodes = []; // Every Node has a description
    this.edges = []; // Contains the sessionedge Object

    // Methods
    this.size = function (){
        var length= this.nodes.length;
        return length;
    }

}

function passToTrain(edgeObj) {
    var tabList = Object.keys(edgeObj);

    tabList.forEach (function (e) {
        var parentList = Object.keys(edgeObj[e]);
        parentList.forEach(function (f) {
            var childList = Object.keys(edgeObj[e][f]);
            childList.forEach( function (g) {
                var _el = edgeObj[e][f][g];

                if (_el.b.image && _el.a.image) {
                    firebase.database().ref('training1/' + Date.now()).set({
                        a_title : _el.a.title,
                        a_url : _el.a.url,
                        a_words : _el.a.mainWords,
                        b_words : _el.b.mainWords,
                        b_title : _el.b.title ,
                        b_url : _el.b.url,
                        a_im : _el.a.image,
                        b_im : _el.b.image,
                        scorearray : _el.array
                    });
                }
            })
        })
    })
}
