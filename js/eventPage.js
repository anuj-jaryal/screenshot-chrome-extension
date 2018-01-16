chrome.browserAction.onClicked.addListener(function(tab) {

    chrome.tabs.captureVisibleTab(null,{'format':'png'},function(image){
        // chrome.runtime.sendMessage({
        //         "canvasImg": image
        // });
        chrome.storage.local.set({'canvasImg': image}, function(){
            
        });
    });


    chrome.tabs.create({'url': chrome.extension.getURL('index.html')},function(tab) {
      
    });

  
});


