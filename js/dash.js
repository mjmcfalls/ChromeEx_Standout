// function requestData() {
//     console.log("Post msg to background");
//     var port = chrome.runtime.connect({ name: "standout" });
//     port.postMessage({ request: "data" });
// };

options = { twelveHour: false };

function sendform(formData) {
    console.log(formData);
    // var port = chrome.runtime.connect({ name: "standout" });
    // port.postMessage({ form: formData });
};

$(document).ready(function () {
    $('.timepicker').timepicker(options);
    $("#form").submit(function (event) {
        // console.log( "Handler for .submit() called." );
        event.preventDefault();
        sendform($('#form').serializeArray());
    });
});
