console.log("contentScript_test.js");

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == "standout");
    port.onMessage.addListener(function (msg) {
        if (msg.action == "reply") {
            console.log("Action:show");
            // alert(msg.action);
            var port = chrome.runtime.connect({ name: "standout" });
            // tempJson = { 'request': "data" }
            // port.postMessage(tempJson);
        }
    });
});



var port = chrome.runtime.connect({ name: "standout" });
port.postMessage({ 'request': "data" });