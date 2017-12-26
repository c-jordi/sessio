// The config file can store all the preferences for the session window display
// Configfile: preferences for the dimension of the window
var previousInfo = {
}
var popupId;
// Makes the window change if the window is hovered over


function saveBrowserInfo(windowId) {
    if (windowId != undefined){
        chrome.windows.get(windowId,function(wind){

            previousInfo = {
                id: wind.id,
                height : wind.height,
                width : wind.width,
                top : wind.top,
                left : wind.left,
                state : wind.state,
                type : wind.type
            }

        })
    }
    else {
        chrome.windows.getLastFocused(function(wind){

            previousInfo = {
                id: wind.id,
                height : wind.height,
                width : wind.width,
                top : wind.top,
                left : wind.left,
                state : wind.state,
                type : wind.type
            }

        })
    }
}

function restoreLastInfo() {
    if (previousInfo.id != undefined){
        var temp = previousInfo;
        var updateInfo = {
            left : temp.left,
            top : temp.top,
            width : temp.width,
            height : temp.height,
            focused : true
        }
        chrome.windows.update(previousInfo.id, updateInfo);
    }
}

function displaySessioWindow () {
    var width;
    var height;
    chrome.windows.getCurrent(function(wind) {
        saveBrowserInfo(wind.id);
        var maxWidth = window.screen.availWidth;
        var maxHeight = window.screen.availHeight;
        width = maxWidth-300;
        height = maxHeight;
        var updateInfo = {
            left: 0,
            top: 0,
            width: maxWidth-300,
            height: maxHeight
        };
        chrome.windows.update(wind.id, updateInfo);
    });

    var newInfo = {
        left : window.screen.availWidth,
        top : 0,
        width : 300,
        height : window.screen.availHeight,
        type : "popup"
    }


    chrome.windows.create(newInfo, function(window){
        // console.log("window", window);
        popupId = window.id;
        var windowId = window.id;
        var tabInfo = {
        windowId : windowId,
            url : "/preview/preview.html",
            active : false,
        }
        chrome.tabs.create(tabInfo, function(){console.log("The tab has been created")});

    })
}


chrome.windows.onRemoved.addListener(function(windowId){
    // console.log(windowId,previousInfo.id)
    if (windowId == popupId){
        restoreLastInfo();
    }
})
