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
            pathId = e.id,
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
                    if (allEdges[tabid] == undefined){allEdges[tabid]={}};
                    if (allEdges[tabid][parentPath] == undefined) {allEdges[tabid][parentPath]={}};
                    if (allEdges[tabid][parentPath][pathId] == undefined){allEdges[tabid][parentPath][pathId]={}};
                    allEdges[tabid][parentPath][pathId][pathString] = linkage;
                }
            })
        }
    })
}

function sessionEdge(node1,node2) {
    this.a = node1;
    this.b = node2;
    this.array = createEdgeArray(node1, node2);
}

function createEdgeArray (node1, node2, clicktext = true) {
    var linkArray = [];
    // This function is used to build the link array used in the link score
    // We assume that node 1 is the parent

    // 1. Matching Url root
        // Redo  using purl.js

    var entry1 = 0;

    var purl1 = purl(node1.url).data.attr,
        purl2 = purl(node2.url).data.attr;

    if (purl1.host == purl2.host){
        entry1 = 1;
    }

    linkArray.push(entry1)

    // 2. Check if Clicktext, if the openerid matches
    var entry2 = 0;

    // Cancels this portion of code if the two nodes are randomly connected
    if(clicktext){
        if (node2.openerid == node1.id) {
            if (node2.clicktext != undefined && node2.clicktext != "") {
                entry2 = 1;
            }
        }
    }
    linkArray.push(entry2);


    // 3. Main Words vs Main words
    var main1 = [],
        main2 = [];
    node1.mainWords.forEach( function(e){
        main1.push(e.word);
    });

    node2.mainWords.forEach( function(e){
        main2.push(e.word);
    });
    main1.sort();
    main2.sort();
    linkArray.push(similarity(main1,main2));

    // 4. TheWords vs theWords

    linkArray.push(similarity(node1.theWords,node2.theWords));

    // 5. Stemmer vs Stemmer
    linkArray.push(similarity(node1.stemmer,node2.stemmer));

    return linkArray;

    // DROPPED INPUTS
    /*

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

    */
}

function similarity(arr1,arr2){
    arr1.sort();
    arr2.sort();
    var array1 = [],
        array2 = [];

    if (arr1.length < arr2.length) {
        array1= arr1;
        array2= arr2;
    } else {
        array1= arr2;
        array2= arr1;
    }

    var diff = _.difference(array1,array2);
    var eval = (array1.length-diff.length)/array1.length;

    return eval;
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

    var _this = this;
    // Methods
    this.size = function (){
        var length = this.nodes.length;
        return length;
    }

}

function passToTrain(edgeObj) {
    var counter = 0;
    var tab1List = Object.keys(edgeObj);
    console.log("Pass to train function called");
    tab1List.forEach (function (e) {
        var path1List = Object.keys(edgeObj[e]);
        path1List.forEach(function (f) {
            var tab2List = Object.keys(edgeObj[e][f]);
            var strict = 0;
            tab2List.forEach( function (g) {
                var path2List = Object.keys(edgeObj[e][f][g]);
                path2List.forEach(function(h){
                    counter++;
                    var _el = edgeObj[e][f][g][h];
                    if (strict<100 && _el.b.image && _el.a.image) { //
                        var newPostRef = firebase.database().ref('training/').push();
                        newPostRef.set({
                            origin : userToken,
                            // a : _el.a,
                            a_favIconUrl : _el.a.favIconUrl,
                            a_title : _el.a.title,
                            a_url : _el.a.url,
                            a_words : _el.a.mainWords,
                            // b : _el.b,
                            b_favIconUrl : _el.b.favIconUrl,
                            b_words : _el.b.mainWords,
                            b_title : _el.b.title ,
                            b_url : _el.b.url,
                            a_im : _el.a.image,
                            b_im : _el.b.image,
                            scorearray : _el.array,
                            trainedBy : []
                        });

                        strict++;
                    }
                })
            })
        })
    })
    // We pass some random training examples
    var pages_len = generalObject.pages.length;
    for (var i=0; i<Math.round(counter/2.); i++){
        var ran1 = Math.round(Math.random()*pages_len),
        ran2 = Math.round(Math.random(0,pages_len)*pages_len);
        var _el = {};
        _el.a=generalObject.pages[ran1],
        _el.b=generalObject.pages[ran2];

        if (checkNotRelated(_el.a,_el.b)){
            _el.array= createEdgeArray (_el.a, _el.b, false);
            var newPostRef = firebase.database().ref('training/').push();
            newPostRef.set({
                origin : userToken,
                // a : _el.a,
                a_favIconUrl : _el.a.favIconUrl,
                a_title : _el.a.title,
                a_url : _el.a.url,
                a_words : _el.a.mainWords,
                // b : _el.b,
                b_favIconUrl : _el.b.favIconUrl,
                b_words : _el.b.mainWords,
                b_title : _el.b.title ,
                b_url : _el.b.url,
                a_im : _el.a.image,
                b_im : _el.b.image,
                scorearray : _el.array,
                trainedBy : []
            });
        }
    }
}

function checkNotRelated(node_a, node_b){
    var check = true;
    if (allEdges[node_a.id] && allEdges[node_a.id][node_a.path] && allEdges[node_a.id][node_a.path][node_b.id] && allEdges[node_a.id][node_a.path][node_b.id][node_b.path]){
        check=false;
    }
    if (allEdges[node_b.id] && allEdges[node_b.id][node_b.path] && allEdges[node_b.id][node_b.path][node_a.id] && allEdges[node_b.id][node_b.path][node_a.id][node_a.path]){
        check=false;
    }
    return check;
}

var exampleSesh = {};
function loadExamples(){

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            //console.log("The config file has been loaded", JSON.parse(xhr.response));
            exampleSesh = JSON.parse(xhr.response);
            console.log(JSON.parse(xhr.response));

        }
    }
    xhr.open("GET", chrome.extension.getURL("../examples/session1.json"),true);
    xhr.send();
}
loadExamples();

var sessionForScore = {};
function sessionCentralityScore(session){
    sessionForScore = session;
    sessionForScore.nodes.forEach(function(node){
        node.score = centralScore(node.id);
    })
    session = sessionForScore;
    sessionForScore = {};
    centralScore = function(id){
        var c_Score = 0;
        sessionForScore.links.forEach(function(link){
            if(link.source == id){
                c_Score += link.value * centralScore(link.target);
            }
        })
        return c_Score;
    }
    centralScore = memoize(centralScore);
    return session;
}

function centralScore(id){
    var c_Score = 0;
    sessionForScore.links.forEach(function(link){
        if(link.source == id){
            c_Score += link.value * centralScore(link.target);
        }
    })
    if (c_Score == 0){c_Score =1};
    return c_Score;
}

function memoize(fn) {
    var memo = {};
    return function (){
        if(memo[JSON.stringify(arguments)]){
            return memo[JSON.stringify[arguments]]
        } else {
            return memo[JSON.stringify[arguments]] = fn(arguments[0])
        }
    }
}



// Neural networks STUFF

const g = new deeplearn.Graph();

// Placeholders are input containers. This is the container for where we will
// feed an input NDArray when we execute the graph.
const inputShape = [inputNbr+1];
const inputTensor = g.placeholder('input', inputShape);

const outputShape = [1];
const outputTensor = g.placeholder('output', outputShape);

// Variables are containers that hold a value that can be updated from
// training.
// Here we initialize the multiplier variable randomly.
const multiplier = g.variable('multiplier', deeplearn.Array2D.randNormal([3, inputNbr+1]));

// Top level graph methods take Tensors and return Tensors.
const hiddenTensor = g.matmul(multiplier, inputTensor);

const hiddenTensorRelu = g.relu(hiddenTensor);

const hiddenTensorInput = g.concat3d(g.constant(1),hiddenTensorRelu);



const costTensor = g.meanSquaredCost(outputTensor, labelTensor);

// Tensors, like NDArrays, have a shape attribute.
console.log(outputTensor.shape);
