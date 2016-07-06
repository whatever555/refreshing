String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

$(document).ready(function(){
    
    var currentTab = null;
    var domains;
    $('.togglebutton').on('click', function(){
        console.log(domains);
        if(currentTab!=null)
        {
            $('.togglebutton').removeClass('selected');
            if($(this).attr('data-toggle')=='on')
            {
                domains+='['+currentTab+']';
                chrome.storage.sync.set({'domains': domains}, function() {
                    $('.onbutton').addClass('selected');
                        chrome.browserAction.setIcon({'path': 'icon128.png'});
                        //chrome.tabs.reload();
                });
            }
            else if($(this).attr('data-toggle')=='off')
            {
                console.log(currentTab+'BEFORE: '+domains);
                domains = domains.replaceAll('['+currentTab+']','');
                    console.log('after: '+domains);
                chrome.storage.sync.set({'domains': domains}, function() {
                    $('.offbutton').addClass('selected');
                        chrome.browserAction.setIcon({'path': 'inactive.png'});
                        //chrome.tabs.reload();
                });
            }
        }
    })

    chrome.storage.sync.get('currentTab', function(itemy) {
        currentTab = itemy.currentTab;
        chrome.storage.sync.get('domains', function(itemz) {
            domains = itemz.domains;
            if (domains==null || domains == false) {
                domains='';
                chrome.browserAction.setIcon({'path': 'inactive.png'});
                $('.offbutton').addClass('selected');
            }else if (domains.indexOf('['+currentTab+']')>-1){
                chrome.browserAction.setIcon({'path': 'icon128.png'});
                $('.onbutton').addClass('selected');
            }else{
                domains = '';
                chrome.browserAction.setIcon({'path': 'inactive.png'});
                $('.offbutton').addClass('selected');
            }
        });
    });
    $('input[type=range]').on('change',function(){
        $('#'+$(this).data('display-element')).html($(this).val());
    })
})
