var sidebar = document.getElementById('popRight');
var fulltab = document.getElementById('popMid');



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

TopView = document.getElementById('popTop');
BottomView = document.getElementById('popBottom');
LeftView = document.getElementById('popLeft');
RightView = document.getElementById('popRight');
