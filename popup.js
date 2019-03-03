function sendform(formData){
    var port = chrome.runtime.connect({name: "standout"});
    port.postMessage({form: formData});
    // port.onMessage.addListener(function(msg) {
    // if (msg.question == "Who's there?")
    //     port.postMessage({answer: "Madame"});
    // else if (msg.question == "Madame who?")
    //     port.postMessage({answer: "Madame... Bovary"});
    // });
    console.log(formData);

};

$(document).ready(function(){
    // console.log("Document ready!");
        $( "#form" ).submit(function(event) {
            // console.log( "Handler for .submit() called." );
            event.preventDefault();
            sendform($('#form').serializeArray());
        });
  });