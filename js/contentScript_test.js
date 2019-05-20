console.log("contentScript_test.js");
var nudgeColor = "#ecffd1ba";
var modalTitle = document.getElementsByClassName("modal-prompt");
console.log("modal-prompt: " + modalTitle[0].innerHTML);
var port = chrome.runtime.connect({ name: "standout" });
port.postMessage({ 'request': modalTitle[0].innerHTML });

// chrome.runtime.onMessage.addListener(function (port) {
//     // console.assert(port.name == "standout");
port.onMessage.addListener(function (msg) {
    console.log(msg);
    if (msg.data) {
        var loathed = [];
        var loved = [];
        var notes = [];
        var LoathedDiv = document.getElementById("loathedacts");
        console.log("Received data from background.js");
        console.log(msg);
        var skillsNode = document.getElementsByClassName("cirating engagementrating");
        var valueNode = document.getElementsByClassName("cirating valuerating");
        console.log("Skill avg: " + msg.data['avg']['skillAvg']);
        for (i = 0; i < skillsNode.length; i++) {
            if (msg.data['avg']['skillAvg'] == parseInt(skillsNode[i].getAttribute("data-rating"))) {
                console.log("Skill matches attribute value");
                skillsNode[i].getElementsByClassName.backgroundColor = nudgeColor;
            }
        }

        for (i = 0; i < valueNode.length; i++) {
            if (msg.data['avg']['valueAvg'] == parseInt(valueNode[i].getAttribute("data-rating"))) {
                console.log("Value matches attribute value");
                valueNode[i].getElementsByClassName.backgroundColor = nudgeColor;
            }
        }
        // console.log(msg.data);
        // for (var key in msg.data) {
        //     console.log(msg.data[key]);
        //     if (msg.data[key].length > 0) {
        //         for (i = 0; i < msg.data[key].length; i++) {
        //             if ("timestamp" in msg.data[key][i]) {
        //                 // console.log(msg.data[key][i]["timestamp"]);
        //                 if (msg.data[key][i]["loathed_act"]) {
        //                     // console.log(moment.unix(msg.data[key][i]["timestamp"]).format("YYYY-MM-DD") + " - " + msg.data[key][i]["loathed_act"]);
        //                     var row = "<tr><td>" + moment.unix(msg.data[key][i]["timestamp"]).format("YYYY-MM-DD") + "</td><td></td><td>" + msg.data[key][i]["loathed_act"] + "</td></tr>"
        //                     LoathedDiv.children[0].innerHTML += LoathedDiv.children[0].innerHTML + row;
        //                     loathed.push(moment.unix(msg.data[key][i]["timestamp"]).format("YYYY-MM-DD") + " - " + msg.data[key][i]["loathed_act"]);

        //                 }
        //                 if (msg.data[key][i]["loved_act"]) {
        //                     // console.log(moment.unix(msg.data[key][i]["timestamp"]).format("YYYY-MM-DD") + " - " + msg.data[key][i]["loved_act"]);
        //                     loved.push(moment.unix(msg.data[key][i]["timestamp"]).format("YYYY-MM-DD") + " - " + msg.data[key][i]["loathed_act"]);
        //                 }
        //                 if (msg.data[key][i]["notes"]) {
        //                     // console.log(moment.unix(msg.data[key][i]["timestamp"]).format("YYYY-MM-DD") + " - " + msg.data[key][i]["notes"]);
        //                     notes.push(moment.unix(msg.data[key][i]["timestamp"]).format("YYYY-MM-DD") + " - " + msg.data[key][i]["loathed_act"]);
        //                 }
        //             }
        //         }
        //     }
        //     console.log(loathed);
        // }

        // alert(msg.action);
        // var port = chrome.runtime.connect({ name: "standout" });
        // tempJson = { 'request': "data" }
        // port.postMessage(tempJson);
    }
});
// });
