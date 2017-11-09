

/*chrome.storage.local.get('pages', function (result) {
    channels = result.pages;
    alert(result.pages);
arrayDisp.innerText = result.pages;
})*/

window.addEventListener('load', function () {

    var arrayDisp = document.getElementById('array');
    console.log("Load Sucessful");
    chrome.storage.local.get('pages', function (result) {
        channels = result.pages;
        var myJSON = JSON.stringify(channels);
        arrayDisp.innerHTML = myJSON;
    });


}, false )
