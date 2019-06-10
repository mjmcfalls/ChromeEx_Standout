var AppName = "standout";
var AppOptions = String(AppName + "Opts");
var options = {
    AlarmInterval: 60
};
var PopupTimeout = 60000 * 5;
var WeekArray = {};
var AlarmId = "e5a55050-8d9f-491b-8562-57ad06091766";

// function uuidv4() {
//     //Function from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
//     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
//         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//     )
// }

function updateBrowserAction(AlarmId) {
    console.log("updateBrowserAction firing");
    chrome.alarms.get(AlarmId, function (alarm) {
        if (alarm) {
            // console.log("Alarm Exists");
            console.log(alarm);
            var t = moment(alarm.scheduledTime);
            console.log("Next Alarm at: " + t.format("YYYY-MM-DD HH:mm:ss"));
            if (t.isBefore(moment())) {
                chrome.alarms.clear(AlarmId)
                chrome.alarms.create(AlarmId, { 'periodInMinutes': options.AlarmInterval });
                chrome.alarms.get(AlarmId, function (alarm) {
                    var titleObj = {};
                    titleObj['title'] = "Stand Daily Check-in\n" + "Next Check-in: " + t.format("YYYY-MM-DD HH:mm:ss");
                    chrome.browserAction.setTitle(titleObj);
                });
            }
            else {
                var titleObj = {};
                titleObj['title'] = "Stand Daily Check-in\n" + "Next Check-in: " + t.format("YYYY-MM-DD HH:mm:ss");
                chrome.browserAction.setTitle(titleObj);
            }

        } else {
            // console.log("Alarm does not exist");
            console.log("Setting alarm - periodInMinutes: " + options.AlarmInterval);
            chrome.alarms.create(AlarmId, { 'periodInMinutes': options.AlarmInterval });
            updateBrowserAction(AlarmId);
        }
    });
}


chrome.runtime.onStartup.addListener(function () {
    // console.log("onStartup - Clear Alarm " + AlarmId);
    // chrome.alarms.clear(AlarmId);
    // updateBrowserAction(AlarmId);
    chrome.storage.sync.get(AppOptions, function (items) {
        // console.log(AppOptions);
        // console.log(items);
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
        updateBrowserAction(AlarmId);
    });
});

chrome.runtime.onConnect.addListener(function (port) {
    var DateString;
    port.onMessage.addListener(function (msg) {
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
                // console.log(result)
                if (result[DateString] === undefined) {
                    // Create new array in Chrome sync for the current day
                    tempJson = {}
                    avg = { 'skillavg': DataArray[0]['skill'], 'valueavg': DataArray[0]['value'] };
                    tempJson[DateString] = DataArray;
                    tempJson[DateString].push(avg);

                    chrome.storage.sync.set(tempJson, function () {
                        // console.log('Added ' + tempJson);
                    });

                } else {
                    // Append data to the existing day.
                    var SkillSum = 0;
                    var ValueSum = 0;
                    var AvgIndex;

                    result[DateString].push(data);

                    for (i = 0; i < result[DateString].length; i++) {
                        if (result[DateString][i]['skillavg']) {
                            AvgIndex = i;
                            // console.log("Contains skillavg: " + i);
                        }
                        else {
                            SkillSum = SkillSum + Number(result[DateString][i]['skill']);
                            ValueSum = ValueSum + Number(result[DateString][i]['value']);
                        }
                    }

                    // console.log((result[DateString].length - 1));
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
            chrome.alarms.clear(AlarmId, function (wasCleared) {
                // console.log("Cleared alarm:" + AlarmId + " : " + wasCleared);
            });
            chrome.storage.sync.get(AppOptions, function (items) {
                if (items[AppOptions].AlarmInterval) {
                    options.AlarmInterval = parseInt(items[AppOptions].AlarmInterval, 10);
                    // console.log("Getting new alarm interval: " + options.AlarmInterval);
                }
                else {
                    // console.log("Default Alarm Interval: " + options.AlarmInterval);
                }
                // console.log("Setting new alarm - periodInMinutes: " + options.AlarmInterval);
                chrome.alarms.create(AlarmId, { 'periodInMinutes': options.AlarmInterval });
                updateBrowserAction(AlarmId);
            });
        }

        if (msg.request) {

            // console.log("Content Script Requested Data - " + msg.request);
            var avg = { "skillAvg": 0, "valueAvg": 0, "count": 0 };
            var soSplitWeek = msg.request.split("-");
            // console.log(soSplitWeek);
            var StartOfWeek = moment(soSplitWeek[0], "DD MMM")
            var EndOfWeek = moment(soSplitWeek[1], "DD MMM")

            chrome.storage.sync.get(function (result) {
                for (var key in result) {
                    var tempMoment = moment(key, "YYYYMMDD");

                    if (tempMoment.isBetween(StartOfWeek, EndOfWeek, null, '[]')) {
                        WeekArray[key] = result[key];

                        for (i = 0; i < result[key].length; i++) {
                            if (result[key][i]['skill'] && result[key][i]['value']) {
                                avg['skillAvg'] += parseInt(result[key][i]['skill']);
                                avg['valueAvg'] += parseInt(result[key][i]['value']);
                                avg['count']++;
                            }
                        }
                    }
                }

                avg['skillAvg'] = Math.round(avg['skillAvg'] / avg['count']);
                avg['valueAvg'] = Math.round(avg['valueAvg'] / avg['count']);

                WeekArray['avg'] = avg;;
                var postData = {};
                postData['data'] = WeekArray;

                port.postMessage(postData);
            });

        }
    });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    // Check if existing alarm matches current alarm; if so fire popup.
    console.log("onAlarm Firing")
    if (AlarmId == alarm.name) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (!(tabs[0].id === undefined)) {
                chrome.windows.create({
                    type: 'popup',
                    url: 'popup.html',
                    width: 500,
                    height: 650,
                    focused: false
                });
            }
        });
        // Update Browser action with next alarm time.
        updateBrowserAction(AlarmId);

    }
});
