console.log("contentScript_test.js");

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == "standout");
    port.onMessage.addListener(function (msg) {
        console.log(msg);
        if (msg.data == "data") {
            console.log("Received data from background.js");
            console.log(msg);
            // alert(msg.action);
            // var port = chrome.runtime.connect({ name: "standout" });
            // tempJson = { 'request': "data" }
            // port.postMessage(tempJson);
        }
    });
});



var port = chrome.runtime.connect({ name: "standout" });
port.postMessage({ 'request': "data" });