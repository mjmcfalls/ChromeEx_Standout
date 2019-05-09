// function sendform(formData) {
//     var port = chrome.runtime.connect({ name: "standout" });
//     port.postMessage({ options: formData });
//     // port.onMessage.addListener(function(msg) {
//     // if (msg.question == "Who's there?")
//     //     port.postMessage({answer: "Madame"});
//     // else if (msg.question == "Madame who?")
//     //     port.postMessage({answer: "Madame... Bovary"});
//     // });
//     console.log(formData);
// };
var AppName = "standout";
var AppOptions = String(AppName + "Opts");
var options = {};

// chrome.storage.sync.get(AppOptions, function (items) {
//     if (items[AppOptions]) {
//         options = items[AppOptions];
//     }
//     console.log(options);
// });

$(document).ready(function () {
    M.AutoInit();
    restore_options()
    // $('select').formSelect();
    // console.log("Document ready!");
    $("#form").submit(function (event) {
        // console.log( "Handler for .submit() called." );
        event.preventDefault();
        save_options($('#form').serializeArray());
        // window.close();
    });
});


// Saves options to chrome.storage
function save_options(data) {
    // console.log("Save_options function");
    var TempOptions = {};
    console.log(data);
    console.log("AlarmInterval: " + AlarmInterval);
    options = data;
    data.forEach(function (item) {
        if (item.name == "AlarmInterval") {
            TempOptions[AppOptions] = { AlarmInterval: item.value };
        }
    });
    console.log("TempOptions");
    console.log(TempOptions);
    chrome.storage.sync.set(TempOptions, function () {
        // Update status to let user know options were saved.
        // var status = document.getElementById('status');
        // status.textContent = 'Options saved.';
        // setTimeout(function () {
        //     status.textContent = '';
        // }, 1000);
        M.toast({ html: 'Changes Saved' })

    });

    var port = chrome.runtime.connect({ name: "standout" });
    port.postMessage({ options: 1 });
    restore_options();
}

// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(AppOptions, function (items) {
        options = items[AppOptions];
        console.log("Restore_options: ");
        console.log(options);
        // document.getElementById('AlarmInterval').value = options.AlarmInterval;
        $('#AlarmInterval').val(options.AlarmInterval);
        // document.getElementById('autoReload').checked = items.autoReload;
        // var radioBtns = document.getElementsByName("warnChoice");
        // document.getElementById(getRadioBtnId(items.noWarn)).checked = true;
    });
}

