// // chrome.runtime.onMessage.addListener(
// //     function (request, sender, sendResponse) {
// //         console.log(sender.tab ?
// //             "from a content script:" + sender.tab.url :
// //             "from the extension");
// //         console.log(request);
// //         // if (request.greeting == "hello")
// //         //     sendResponse({ farewell: "goodbye" });
// //     });

// chrome.runtime.onConnect.addListener(function (port) {
//     console.assert(port.name == "standout");
//     port.onMessage.addListener(function (msg) {
//         if (msg.action == "show") {
//             console.log("Action:show");
//             // alert(msg.action);
//             var port = chrome.runtime.connect({ name: "standout" });
//             var currentDate = new Date();
//             var DateString = currentDate.getFullYear() + ('0' + (currentDate.getMonth() + 1)).slice(-2) + ('0' + currentDate.getDate()).slice(-2);
//             tempJson = {}
//             var data = "Return from Content"
//             tempJson[DateString] = data;
//             port.postMessage(tempJson);
//         }
//     });
// });
var engageTestValue = 2;
console.log("Content script loaded");
function setUserValues(className) {
    var n = document.getElementsByClassName("modalHeaderText");

    console.log(n);
    console.log(n[0]);
    n[0].innerText = "Test Insert";
    // var erating = document.getElementsByClassName("cirating engagementrating");
    // console.log(erating);
    // var vrating = document.getElementsByClassName("cirating valuerating");

    // console.log(vrating);
}
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (!mutation.addedNodes) return

        for (var i = 0; i < mutation.addedNodes.length; i++) {
            // do things to your newly added nodes here
            var node = mutation.addedNodes[i]
            if (node.className == "modalPageContainer") {
                // console.log(node)
                setUserValues(node.className);
            }
            ;
        }
    })
})

observer.observe(document.body, {
    childList: true
    , subtree: true
    , attributes: false
    , characterData: false
})

// stop watching using:
// observer.disconnect()