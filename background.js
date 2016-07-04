// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {

  chrome.tabs.executeScript(tabId, {file: "setData.js"} );
  if (changeInfo.status == 'complete') {
    // do your things
    chrome.tabs.executeScript(tabId, {file: "jquery.js"} );
    chrome.tabs.executeScript(tabId, {file: "main.js"} );
    setTimeout(function() { changeIcon(extractDomain(tab.url)); }, 120);

   }
})
chrome.tabs.onActivated.addListener(function(activeInfo) {
  // how to fetch tab url using activeInfo.tabid
  chrome.tabs.executeScript(activeInfo.tabId, {file: "setData.js"} );
  chrome.tabs.get(activeInfo.tabId, function(tab){
      setTimeout(function() { changeIcon(extractDomain(tab.url)); }, 120);
  });
});

    function changeIcon(currentTab) {
        chrome.storage.sync.get('domains', function(itemz) {
            domains = itemz.domains;
            if (domains==null || domains == false) {
                domains='';
                chrome.browserAction.setIcon({'path': 'inactive.png'});
            }else if (domains.indexOf('['+currentTab+']')>-1){
                chrome.browserAction.setIcon({'path': 'icon128.png'});
            }else{
                domains = '';
                chrome.browserAction.setIcon({'path': 'inactive.png'});
            }
        });
    }

    function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}
