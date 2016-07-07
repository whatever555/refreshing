// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  chrome.tabs.executeScript(tabId, {file: "setData.js"} );
  if (changeInfo.status == 'complete') {
    // do your things
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
        jsonData=[];
        currentSiteOptions=[];
        chrome.storage.sync.get('jsonData', function(itemz) {
            jsonData = itemz.jsonData;
            if (typeof jsonData === typeof undefined || jsonData == false || jsonData == null) {
                chrome.browserAction.setIcon({'path': 'icon128.png'});
            }else{
                currentSiteOptions = getItemByDomain(currentTab, jsonData);
                if (currentSiteOptions.active === true)
                {
                    chrome.browserAction.setIcon({'path': 'active.png'});
                }
                else {
                    chrome.browserAction.setIcon({'path': 'inactive.png'});
                }
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

function getItemByDomain(domainStr, jsonData){
    if(jsonData)
    for(var i=0;i<jsonData.length;i++)
    {
        if (!(typeof jsonData[i] === typeof undefined || jsonData[i] == false || jsonData[i] == null))
        if(jsonData[i].domain === domainStr){
            return jsonData[i];
        }
    }
    return getDefaultOptionValues(domainStr);
}

function getDefaultOptionValues(currentTab){
    return {'domain':currentTab,'active':false,'refreshRate':500,'bufferSize':3};
}
