

var mybutton1 = document.getElementById('mybutton1');
var mybutton2 = document.getElementById('mybutton2');

window.addEventListener('mouseover', function(){
    chrome.runtime.sendMessage({fn: "highPreview"}, function(response) {
      console.log(response.farewell);
    });
})

mybutton1.addEventListener('click',function(){
    chrome.runtime.sendMessage({fn: "navigate", url: "http://www.google.com"}, function(response) {
      console.log(response.farewell);
    });
})
mybutton2.addEventListener('click',function(){
    chrome.runtime.sendMessage({fn: "navigate", url: "http://www.twitter.com"}, function(response) {
      console.log(response.farewell);
    });
})
