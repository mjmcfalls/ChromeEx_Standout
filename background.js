var AppName = "standout";
var AlarmInterval = 15;
chrome.runtime.onConnect.addListener(function (port) {
    // console.assert(port.name == "standout");
    console.log(port.name);
    console.log(port);
    port.onMessage.addListener(function (msg) {
        console.log(msg);
        if (msg.form) {
            var currentDate = new Date();
            var DateString = currentDate.getFullYear() + ('0' + (currentDate.getMonth() + 1)).slice(-2) + ('0' + currentDate.getDate()).slice(-2);
            // console.log(DateString);
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
            // console.log(data);

            chrome.storage.sync.get(DateString, function (result) {
                console.log(result)
                if (result[DateString] === undefined) {
                    tempJson = {}
                    tempJson[DateString] = data;
                    // console.log('Setting: ' + DateString);
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
    });
});

console.log("Setting alarm: periodInMinutes 1");
chrome.alarms.create("standoutAlarm", { 'periodInMinutes': AlarmInterval });

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log("Firing alarm", alarm);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs[0]);
        // chrome.tabs.sendMessage(tabs[0].id, { action: "show" }, function (response) { });
        if (!(tabs[0].id === undefined)) {
            // console.log(tabs[0]);
            // var port = chrome.tabs.connect(tabs[0].id, { name: "standout" });
            // console.log("Posting message to " + tabs[0].title)
            // port.postMessage({ action: "show" });
            // chrome.tabs.executeScript(tabs[0].id, {
            //     file: 'test.js'
            // });
            chrome.windows.create({
                type: 'popup',
                url: 'popup.html',
                width: 500,
                height: 650,
                // left: 5,
                // top: 100,
                focused: false
            }, function (window) {
                console.log("Create Window callback");
                // chrome.windows.remove(tab.id);
                setTimeout(function () {
                    console.log(window);
                    console.log("Closing Window");
                    chrome.windows.remove(window.id);
                }, 60000);

            });
        }
    });
});

