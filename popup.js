String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var jsonData=[];
var currentSnapshotInTime=0;

$(document).ready(function(){

    var currentTab = null;
    var currentSiteOptions=[];
    $('.togglebutton').on('click', function(){
        $but = $(this);
        chrome.storage.sync.get('currentTab', function(itemy) {
            currentTab = itemy.currentTab;
            currentSiteOptions.domain = currentTab;
            if(currentTab!=null)
            {
                $('.togglebutton').removeClass('selected');
                if($but.attr('data-toggle')=='on')
                {
                    currentSiteOptions.active = true;
                    jsonData = updateJsonItem(currentSiteOptions, jsonData);
                    chrome.storage.sync.set({'jsonData': jsonData}, function() {
                        $('.onbutton').addClass('selected');
                            chrome.browserAction.setIcon({'path': 'active.png'});
                            //chrome.tabs.reload();
                    });
                }
                else if($but.attr('data-toggle')=='off')
                {

                    currentSiteOptions.active = false;
                    jsonData = updateJsonItem(currentSiteOptions, jsonData);
                    chrome.storage.sync.set({'jsonData': jsonData}, function() {
                        $('.offbutton').addClass('selected');
                            chrome.browserAction.setIcon({'path': 'inactive.png'});
                            //chrome.tabs.reload();
                    });
                }
            }
        });
    })

    chrome.storage.sync.get('currentTab', function(itemy) {
        currentTab = itemy.currentTab;
        chrome.storage.sync.get('jsonData', function(itemz) {
            jsonData = itemz.jsonData;
            if (typeof jsonData === typeof undefined || jsonData == false || jsonData == null) {
                jsonData = [];
                currentSiteOptions = getDefaultOptionValues(currentTab);
                $('.offbutton').addClass('selected');
            }else{
                currentSiteOptions = getItemByDomain(currentTab, jsonData);
            }

            if (currentSiteOptions.active === true){
                chrome.browserAction.setIcon({'path': 'active.png'});
                $('.onbutton').addClass('selected');
            }else{
                chrome.browserAction.setIcon({'path': 'inactive.png'});
                $('.offbutton').addClass('selected');
            }
            console.log('SETTig themn'+currentSiteOptions.refreshRate);
            $('#refresh-rate-slider').val(currentSiteOptions.refreshRate);
            $('#buffer-size-slider').val(currentSiteOptions.bufferSize);

            $('#refresh-rate-display').html($('#refresh-rate-slider').val());
            $('#buffer-size-display').html($('#buffer-size-slider').val());
        });
    });
    $('input[type=range]').on('change',function(){
    $changedElement = $(this);
        $('#'+$changedElement.data('display-element')).html($changedElement.val());
        chrome.storage.sync.get('jsonData', function(itemz) {
            jsonData = itemz.jsonData;
            if (typeof jsonData === typeof undefined || jsonData == false || jsonData == null) {
                jsonData = [];
                currentSiteOptions = getDefaultOptionValues(currentTab);
                $('.offbutton').addClass('selected');
            }else{
                currentSiteOptions = getItemByDomain(currentTab, jsonData);
            }

            if($changedElement.attr('name')=="refresh-rate") {
                currentSiteOptions.refreshRate = parseInt($changedElement.val());
            }
            if($changedElement.attr('name')=="buffer-size") {
                currentSiteOptions.bufferSize = parseInt($changedElement.val());
            }
            console.log(currentSiteOptions);
            updateJsonItem(currentSiteOptions, jsonData);
            chrome.storage.sync.set({'jsonData': jsonData}, function() {
            });
        })
    })

});


Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function getDefaultOptionValues(currentTab){
    return {'domain':currentTab,'active':false,'refreshRate':500,'bufferSize':3};
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

function updateJsonItem(currentSiteOptions, jsonData) {
    for(var i=0;i<jsonData.length;i++)
    {
        if (!(typeof jsonData[i] === typeof undefined || jsonData[i] == false || jsonData[i] == null))
        if(jsonData[i].domain === currentSiteOptions.domain){
            jsonData[i] = currentSiteOptions;
            return jsonData;
        }
    }
    jsonData.push(currentSiteOptions);
    return jsonData;
}
