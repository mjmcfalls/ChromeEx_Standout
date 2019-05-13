var AppName = "standout";
var AppOptions = String(AppName + "Opts");
var options = {
    AlarmInterval: 60
};
var PopupTimeout = 60000 * 5;

function createAveragesForDay(DataArr) {
    for (i = 0; i < DataArr.length; i++) {
        console.log(DataArr[i]);
    }

};

chrome.storage.sync.get(AppOptions, function (items) {
    console.log(AppOptions);
    console.log(items);
    if (items[AppOptions]) {
        if (items[AppOptions].AlarmInterval) {
            // console.log("Setting custom alarm interval: " + items[AppOptions].AlarmInterval);
            options.AlarmInterval = parseInt(items[AppOptions].AlarmInterval, 10);
            console.log("Setting custom alarm interval: " + options.AlarmInterval);
            // console.log(typeof (options.AlarmInterval));
        }
    }
    else {
        console.log("No custom alarm interval set.");
        console.log("Default Alarm Interval: " + options.AlarmInterval);
    }

    console.log("Setting alarm - periodInMinutes: " + options.AlarmInterval);
    chrome.alarms.create(AppName, { 'periodInMinutes': options.AlarmInterval });
});


chrome.runtime.onConnect.addListener(function (port) {
    // console.assert(port.name == "standout");
    var DateString;
    console.log(port.name);
    console.log(port);
    port.onMessage.addListener(function (msg) {
        console.log(msg);
        var DataArray = [];
        if (msg.form) {
            var data = {};
            msg.form.forEach(function (item) {
                if (item.name == "dateid") {
                    DateString = item.value;
                }
                else {
                    data[item.name] = item.value;
                }
            });
            DataArray.push(data);
            chrome.storage.sync.get(DateString, function (result) {
                console.log(result)
                if (result[DateString] === undefined) {
                    // Create new array in Chrome sync for the current day
                    tempJson = {}
                    avg = { 'skillavg': DataArray[0]['skill'], 'valueavg': DataArray[0]['value'] };
                    tempJson[DateString] = DataArray;
                    tempJson[DateString].push(avg);
                    console.log(tempJson);


                    chrome.storage.sync.set(tempJson, function () {
                        // console.log('Added ' + tempJson);
                    });

                } else {
                    // Append data to the existing day.
                    console.log("Appending data to existing results.");

                    var SkillSum = 0;
                    var ValueSum = 0;
                    var AvgIndex;

                    result[DateString].push(data);

                    for (i = 0; i < result[DateString].length; i++) {
                        if (result[DateString][i]['skillavg']) {
                            AvgIndex = i;
                            console.log("Contains skillavg: " + i);
                        }
                        else {
                            SkillSum = SkillSum + Number(result[DateString][i]['skill']);
                            ValueSum = ValueSum + Number(result[DateString][i]['value']);
                        }
                    }

                    console.log((result[DateString].length - 1));
                    SkillAvg = SkillSum / (result[DateString].length - 1);
                    ValueAvg = ValueSum / (result[DateString].length - 1);
                    avg = { 'skillavg': SkillAvg, 'valueavg': ValueAvg };

                    result[DateString][AvgIndex] = avg;
                    chrome.storage.sync.set(result, function () {
                        // console.log(result);
                    });
                }
            });
        }

        if (msg.options) {
            // console.log("options");
            // console.log(msg);
            chrome.alarms.clear(AppName, function (wasCleared) {
                console.log("Cleared alarm:" + AppName + " : " + wasCleared);
            });
            chrome.storage.sync.get(AppOptions, function (items) {
                if (items[AppOptions].AlarmInterval) {
                    options.AlarmInterval = parseInt(items[AppOptions].AlarmInterval, 10);
                    // console.log("Getting new alarm interval: " + options.AlarmInterval);
                }
                else {
                    // console.log("Default Alarm Interval: " + options.AlarmInterval);
                }
                console.log("Setting new alarm - periodInMinutes: " + options.AlarmInterval);
                chrome.alarms.create(AppName, { 'periodInMinutes': options.AlarmInterval });
            });
        }

        if (msg.request) {

            console.log("Requesting data from content script");
            var StartOfWeek = moment().startOf('week').toDate();
            var EndOfWeek = moment().endOf('week').toDate();
            console.log("Start Of Week: " + StartOfWeek);
            console.log("End Of Week: " + EndOfWeek);
            chrome.storage.sync.get(function (result) { console.log(result) })

        }
    });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    // Check if between lunch time.
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
                // }, function (window) {
                // console.log("Create Window callback - " + window.id);
                // // chrome.windows.remove(tab.id);
                // setTimeout(function () {
                //     console.log(window);
                //     console.log("Closing Window: " + window.id);

                //     chrome.windows.remove(window.id);
                // }, PopupTimeout);

            });
        }
    });
});


