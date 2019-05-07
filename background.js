
// chrome.browserAction.setBadgeText({text: 'ON'});
// chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//       console.log('The color is green.');
//     });
// //   });
// chrome.tabs.getSelected(null, function(tab) {

//     chrome.pageAction.show(tab.id);


// });
chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == "standout");
    // console.log(port.name);
    // console.log(port);
    port.onMessage.addListener(function (msg) {
        if (msg.form) {
            var currentDate = new Date();
            var DateString = currentDate.getFullYear() + ('0' + (currentDate.getMonth() + 1)).slice(-2) + ('0' + currentDate.getDate()).slice(-2);
            console.log(DateString);
            var data = [{
                name: "timestamp",
                timestamp: Math.floor(Date.now() / 1000),
                data: msg.form
            }]
            // console.log(currentDate.toLocaleFormat('%Y%m%d'));
            // console.log(msg)
            // console.log("Value: " + msg.form[0].value)
            // console.log("Skill: " + msg.form[1].value)
            // console.log("Loved: " + msg.form[2].value)
            // console.log("Loathed: " + msg.form[3].value)

            var PreppedData = JSON.stringify(data)
            console.log(data);

            chrome.storage.sync.get(DateString, function (result) {
                console.log(result)
                if (result[DateString] === undefined) {
                    tempJson = {}
                    tempJson[DateString] = data;
                    console.log('Setting: ' + DateString);
                    chrome.storage.sync.set(tempJson, function () {
                        // console.log('Added ' + tempJson);
                    });

                } else {
                    // console.log('Value currently is ' + result);
                    result[DateString].push(data[0])
                    chrome.storage.sync.set(result, function () {
                        // console.log('Appending' + data);
                    });
                }

            });
        }

        // chrome.storage.local.clear(function () {
        //     var error = chrome.runtime.lastError;
        //     if (error) {
        //         console.error(error);
        //     }
        // });


        //   if (msg.joke == "Knock knock")
        //     port.postMessage({question: "Who's there?"});
        //   else if (msg.answer == "Madame")
        //     port.postMessage({question: "Madame who?"});
        //   else if (msg.answer == "Madame... Bovary")
        //     port.postMessage({question: "I don't get it."});
    });
});


