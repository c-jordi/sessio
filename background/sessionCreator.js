// Link Scoring System
var allLinks = {}; // this object stores all the links of the tree

        // Example
        //
        //      allLinks = {
        //           tabid : {
        //                path 1 : {
        //                      path2 : {a: path1, b: path 2, text: "" ,  ... },
        //
        //

// the is always the chronological parent node
// For display we will write a function to turn the object into an array

function sessionLink(path1,path2) {
    this.a = path1;
    this.b = path2;
    this.text = text;
    this.score = 0; // the score goes from 0 to 1
}


function createLinkArray (node1, node2) {
    // Variables
    //          
    //
    //
    //
    //
    //

}







function calculateChild(id, path) {
    // The function determines how many pages have been opened from this page



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
