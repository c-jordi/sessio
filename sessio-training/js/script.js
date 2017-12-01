// Parent
var a_image = document.getElementById('parent_im');
var a_fav = document.getElementById('parent_fav');
var a_title = document.getElementById('parent_title');
var a_url = document.getElementById('parent_url');
var a_words = document.getElementById('parent_words');

// Child
var b_image = document.getElementById('child_im');
var b_fav = document.getElementById('child_fav');
var b_title = document.getElementById('child_title');
var b_url = document.getElementById('child_url');
var b_words = document.getElementById('child_words');

// Buttons
var sameSess = document.getElementById('same');
var notSess = document.getElementById('skip');
var noComm = document.getElementById('different');



var database = firebase.database();


var ref = database.ref('training');
ref.once('value', gotData, errData);

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
var currentSample = {};

function displaySample() {

    if (samples.length >1){
        var sample_name = samples.pop();
        console.log("samples length: ", samples.length);

        currentSample = trainingset[sample_name];
        currentSample.id = sample_name;
        // console.log("currentSample", currentSample);
        delete trainingset[sample_name];
        console.log("delete sample ", trainingset[sample_name]);
        // console.log("currentSample", currentSample);
        // a image
        a_image.src=currentSample.a_im;
        a_fav.src=currentSample.a.favIconUrl;

        a_title.innerText = currentSample.a_title;
        a_url.innerText = currentSample.a_url.slice(0,50)+'...';
        var listWordsA ="";
        currentSample.a_words.forEach( function(e){
            listWordsA += e.word + ", "
        })
        a_words.innerText = listWordsA;

        //  image
        b_image.src=currentSample.b_im;
        b_fav.src=currentSample.b.favIconUrl;
        b_title.innerText = currentSample.b_title;
        b_url.innerText = currentSample.b_url.slice(0,50)+'...';
        var listWordsB ="";
        currentSample.b_words.forEach( function(e){
            listWordsB += e.word + ", "
        })
        b_words.innerText = listWordsB;
    }
    else {
        a_image.src="";
        b_image.src="";
        a_title.innerText = "NO MORE TRAINING";
        b_title.innerText = "NO MORE TRAINING";
        console.log("Trained ARR:", trainedArr);
    }
}

var trainedArr = [];
function trainDone(value) {

    if (value == "true"){
        trainedArr.push({id: currentSample.id, output: 1});
    }
    else if(value == "false"){
            trainedArr.push({id: currentSample.id, output: 0});
    }

    displaySample();
}

sameSess.onclick= function (){trainDone("true")};
notSess.onclick=  function (){trainDone("false")};
noComm.onclick=  function (){displaySample()};
