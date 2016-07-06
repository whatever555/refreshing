String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var jsonData=[];
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
                    currentSiteOptions.active = 'true';
                    jsonData = updateJsonItem(currentSiteOptions, jsonData);
                    chrome.storage.sync.set({'jsonData': jsonData}, function() {
                        $('.onbutton').addClass('selected');
                            chrome.browserAction.setIcon({'path': 'icon128.png'});
                            //chrome.tabs.reload();
                    });
                }
                else if($but.attr('data-toggle')=='off')
                {
                    
                    currentSiteOptions.active = 'false';
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
                currentSiteOptions = {'domain':currentTab, 'active':'false'};
                $('.offbutton').addClass('selected');
            }else{
                currentSiteOptions = getItemByDomain(currentTab, jsonData);
            }
            
            if (currentSiteOptions.active === 'true'){
                chrome.browserAction.setIcon({'path': 'icon128.png'});
                $('.onbutton').addClass('selected');
            }else{
                chrome.browserAction.setIcon({'path': 'inactive.png'});
                $('.offbutton').addClass('selected');
            }
        });
    });
    $('input[type=range]').on('change',function(){
        $('#'+$(this).data('display-element')).html($(this).val());
    })
})


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


function getItemByDomain(domainStr, jsonData){
    if(jsonData)
    for(var i=0;i<jsonData.length;i++)
    {
        if (!(typeof jsonData[i] === typeof undefined || jsonData[i] == false || jsonData[i] == null))
        if(jsonData[i].domain === domainStr){
            return jsonData[i];
        }
    }
    return {'domain':domainStr,'active':false};
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