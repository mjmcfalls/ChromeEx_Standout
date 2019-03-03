
// chrome.browserAction.setBadgeText({text: 'ON'});
// chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//       console.log('The color is green.');
//     });
// //   });
// chrome.tabs.getSelected(null, function(tab) {

//     chrome.pageAction.show(tab.id);


// });
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "standout");
    console.log(port.name);
    // console.log(port);
    port.onMessage.addListener(function(msg) {
        if(msg.form){
            console.log(msg)
            console.log("Value: " + msg.form[0].value)
            console.log("Skill: " + msg.form[1].value)
        }
        
    //   if (msg.joke == "Knock knock")
    //     port.postMessage({question: "Who's there?"});
    //   else if (msg.answer == "Madame")
    //     port.postMessage({question: "Madame who?"});
    //   else if (msg.answer == "Madame... Bovary")
    //     port.postMessage({question: "I don't get it."});
    });
  });