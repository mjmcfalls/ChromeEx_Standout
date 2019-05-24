console.log("contentScript_test.js");
var nudgeColor = "#ecffd1ba";
var port = chrome.runtime.connect({ name: "standout" });

function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
}

function checkElement(selector) {
    if (document.querySelector(selector) === null) {
        return rafAsync().then(() => checkElement(selector));
    } else {
        return Promise.resolve(true);
    }
}

checkElement(".modal-prompt").then((element) => {
    var element = document.createElement('style'), sheet;
    var styles = ".modal.checkin-wizard .nudge { background-color: #ecffd1ba }"
    // Append style element to head
    document.head.appendChild(element);

    // Reference to the stylesheet
    sheet = element.sheet;
    sheet.insertRule(styles, 0);
    // console.info(element);
    var modalTitle = document.getElementsByClassName("modal-prompt");
    console.log("modal-prompt: " + modalTitle[0].innerHTML);

    port.postMessage({ 'request': modalTitle[0].innerHTML });
});


// chrome.runtime.onMessage.addListener(function (port) {
//     // console.assert(port.name == "standout");
port.onMessage.addListener(function (msg) {
    console.log(msg);
    if (msg.data) {
        console.log("Received data from background.js");
        console.log(msg);
        var loathed = [];
        var loved = [];
        var notes = [];
        // var LoathedDiv = document.getElementById("loathedacts");
        var skillsNode = document.getElementsByClassName("cirating engagementrating");
        var valueNode = document.getElementsByClassName("cirating valuerating");
        var textFields = document.getElementsByClassName("input strText");

        console.log("Skill avg: " + msg.data['avg']['skillAvg']);
        for (i = 0; i < skillsNode.length; i++) {
            if (msg.data['avg']['skillAvg'] == parseInt(skillsNode[i].getAttribute("data-rating"))) {
                console.log("Skill matches attribute value");
                skillsNode[i].style.backgroundColor = nudgeColor;
            }
        }

        for (i = 0; i < valueNode.length; i++) {
            if (msg.data['avg']['valueAvg'] == parseInt(valueNode[i].getAttribute("data-rating"))) {
                console.log("Value matches attribute value");
                valueNode[i].style.backgroundColor = nudgeColor;
            }
        }

        // for (var key in msg.data) {
        //     console.log(msg.data[key]);
        //     if (msg.data[key].length > 0) {
        //         for (i = 0; i < msg.data[key].length; i++) {
        //             if ("timestamp" in msg.data[key][i]) {
        //                 // console.log(msg.data[key][i]["timestamp"]);
        //                 if (msg.data[key][i]["loathed_act"]) {
        //                     loathed.push(moment.unix(msg.data[key][i]["timestamp"]).format("YYYY-MM-DD") + " - " + msg.data[key][i]["loathed_act"]);
        //                 }
        //                 if (msg.data[key][i]["loved_act"]) {
        //                     loved.push(moment.unix(msg.data[key][i]["timestamp"]).format("YYYY-MM-DD") + " - " + msg.data[key][i]["loathed_act"]);
        //                 }
        //                 if (msg.data[key][i]["notes"]) {
        //                     notes.push(moment.unix(msg.data[key][i]["timestamp"]).format("YYYY-MM-DD") + " - " + msg.data[key][i]["loathed_act"]);
        //                 }
        //             }
        //         }
        //     }
        // }


        // for (i = 0; i < textFields.length; i++) {
        //     if (textFields[i].getAttribute("data-gaaction") == "love") {
        //         console.log("loathed txt");
        //         console.log(loathed);
        //     }
        //     else if (textFields[i].getAttribute("data-gaaction") == "loathe") {
        //         console.log("loved txt");
        //         console.log(loved);
        //     }
        // }


        // alert(msg.action);
        // var port = chrome.runtime.connect({ name: "standout" });
        // tempJson = { 'request': "data" }
        // port.postMessage(tempJson);
    }
});
// });
