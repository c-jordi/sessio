var sidebar = document.getElementById('sidebar');
var fulltab = document.getElementById('fulltab');


sidebar.addEventListener('click',function () {
    console.log("sidebar");
    chrome.runtime.sendMessage({fn: "sidebar"}, function(response) {
      console.log(response.farewell);
    });
})

fulltab.addEventListener('click',function () {
    console.log("fullbar");
    chrome.runtime.sendMessage({fn: "fulltab"}, function(response) {
      console.log(response.farewell);
    });
})
