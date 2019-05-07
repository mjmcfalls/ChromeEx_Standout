// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         console.log(request);
//         // if (request.greeting == "hello")
//         //     sendResponse({ farewell: "goodbye" });
//     });
console.log("Content script loaded");

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == "standout");
    port.onMessage.addListener(function (msg) {
        if (msg.action == "show") {
            console.log("Action:show");
            // alert(msg.action);
            var port = chrome.runtime.connect({ name: "standout" });
            port.postMessage({ "20190507": "Who's there?" });
        }
    });
});
