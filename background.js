
// chrome.browserAction.setBadgeText({text: 'ON'});
// chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//       console.log('The color is green.');
//     });
// //   });
// chrome.tabs.getSelected(null, function(tab) {

//     chrome.pageAction.show(tab.id);


// });
chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.greeting === "GetURL" )
    {
        var tabURL = "Not set yet";
        chrome.tabs.query({active:true},function(tabs){
            if(tabs.length === 0) {
                sendResponse({});
                return;
            }
            tabURL = tabs[0].url;
            sendResponse( {navURL:tabURL} );
        });        
    }
}