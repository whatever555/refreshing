$(document).ready(function(){

    localStorage.setItem("nowdomain", document.domain);
    $.ajaxSetup({ cache: false });
    var myRand = getRandomInt(0, 99999999999);
    var increment=0;
    var cssFiles = [];
    chrome.storage.sync.get('domains', function(itemz) {
        domains = itemz.domains;
        if (typeof domains === typeof undefined || domains == false || domains == null) {
            domains = '';
        }
        if (domains.indexOf('['+document.domain+']')>-1) {
            getCssFiles();
        }
    });

    function getCssFiles(){
        $('[rel]').each(function(){
            $data = $(this).attr('href');
            if($data.indexOf('css')>-1 || $data.indexOf('style')>-1)
            {
                cssFiles.push($(this).attr('href'));
            }
        })
        setInterval(refreshCss, 500);
    }
    function getCssToRemove(filename, filetype){
        var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
        var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
        var allsuspects=document.getElementsByTagName(targetelement)

        for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
            {
                str = allsuspects[i].href;
                str.replace("<link rel=\"stylesheet\" type=\"text\\css\" href=\"", "");
                str.replace("\">", "");
                var res = str.split("?");
                if (parseInt(res[1]) < (parseInt(myRand+''+increment) - 3) || res.length==1) {
                    var $ht = $(allsuspects[i]);
                    if($ht.length)
                    $ht.remove();
                }
            }
        }
        return allsuspects;
    }

    var toType = function(obj) {
      return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $('#header').append('<div class="click-me">Click me</div>');

    function refreshCss(){
        for(var i=0;i<cssFiles.length;i++)
        {
            var cssId = 'myCss';  // you could encode the css path itself to generate id..
            var removeCss = getCssToRemove(cssFiles[i],"css");
            var head  = document.getElementsByTagName('head')[0];
            var link  = document.createElement('link');
            link.id   = cssId;
            link.rel  = 'stylesheet';
            link.type = 'text/css';
            link.href = cssFiles[i]+'?'+myRand+''+increment;
            link.media = 'all';
            head.appendChild(link);
        }
        increment++;

    }

    function inArray(needle, haystack) {
        var length = haystack.length;
        for(var i = 0; i < length; i++) {
            if(haystack[i] == needle) return true;
        }
        return false;
    }
})
