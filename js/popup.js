function sendform(formData) {
    console.log(formData);
    var port = chrome.runtime.connect({ name: "standout" });
    port.postMessage({ form: formData });
};

$(document).ready(function () {
    var currentDate = new Date();
    var DateString = currentDate.getFullYear() + ('0' + (currentDate.getMonth() + 1)).slice(-2) + ('0' + currentDate.getDate()).slice(-2);
    // // console.log(DateString);
    // var data = [{
    //     name: "timestamp",
    $('#timestamp').val(Math.floor(Date.now() / 1000));
    $('#datedid').val(DateString);
    //     data: msg.form
    // }]
    $("#form").submit(function (event) {
        // console.log( "Handler for .submit() called." );
        event.preventDefault();
        sendform($('#form').serializeArray());
        window.close();
    });
});