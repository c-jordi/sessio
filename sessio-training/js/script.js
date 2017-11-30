// Parent a
var a_image = document.getElementById('parent_im');
var a_title = document.getElementById('parent_title');
var a_url = document.getElementById('parent_url');
var a_words = document.getElementById('parent_words');

// Child brigthness(color)
var b_image = document.getElementById('child_im');
var b_title = document.getElementById('child_title');
var b_url = document.getElementById('child_url');
var b_words = document.getElementById('child_words');

// Buttons
var sameSess = document.getElementById('same');
var notSess = document.getElementById('skip');
var noComm = document.getElementById('different');



var database = firebase.database();


var ref = database.ref('training1');
ref.on('value', gotData, errData);

var trainingset={};
var samples = []
function gotData(data) {
    trainingset = data.val();
    console.log(trainingset);
    samples = Object.keys(trainingset);
    displaySample();

}

function errData(err) {
    console.log("Error with Firebase Retrieving");
    console.log(err);
}
var currentSample = {score: [], result: 0};

function displaySample() {

    if (samples.length >1){
        var sample_name = samples.pop();
        currentSample = trainingset[sample_name];
        console.log("currentSample", currentSample);
        delete trainingset[sample_name];
        console.log("currentSample", currentSample);
        console.log(trainingset);
        // a image
        a_image.src=currentSample.a_im;
        a_title.innerText = currentSample.a_title;
        a_url.innerText = currentSample.a_url.slice(0,50)+'...';
        var listWordsA ="";
        currentSample.a_words.forEach( function(e){
            listWordsA += e.word + ", "
        })
        a_words.innerText = listWordsA;

        //  image
        b_image.src=currentSample.b_im;
        b_title.innerText = currentSample.b_title;
        b_url.innerText = currentSample.b_url.slice(0,50)+'...';
        var listWordsB ="";
        currentSample.b_words.forEach( function(e){
            listWordsB += e.word + ", "
        })
        b_words.innerText = listWordsB;

    }
}

var trainedArr = [];
function trainDone(value) {

    var scorearr = currentSample.scorearray,
        result;
    if (value == "true"){
        result =1;
        trainedArr.push({array: scorearr, result: result });
    }
    else if (value == "false") {
        result =0;
        trainedArr.push({array: scorearr, result: result });
    }
    console.log("Trained Obj: ", trainedArr);
    displaySample();

}

    same.onclick = function () {console.log("Same Session")};
    skip.onclick = function () {console.log("Skip decision")};
    different.onclick = function () {console.log("Different Session")};
