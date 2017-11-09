console.log('background loaded!');


// chrome.tabs.onCreated.addListener(function (tab) {
//   console.log('onCreated', tab);
// });

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {

  if (change.status == "complete") {
    console.log('onUpdated', tabId, change, tab);
    var saveObj = {
      id : tab.id,
      favIconUrl : tab.favIconUrl,
      openerTabId : tab.openerTabId,
      timeStamp : Date.now(),
      title : tab.title,
      url : tab.url
    }
    pushNewPage(saveObj);
  }
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
  chrome.storage.sync.get(function(storedObj) {
    if(typeof(storedObj["pages"]) !== 'undefined' && storedObj["pages"] instanceof Array) {
      storedObj["pages"].push(pageObj);
    } else {
      storedObj["pages"] = [pageObj];
    }
    chrome.storage.sync.set(storedObj);
  });
}
