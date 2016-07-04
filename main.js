$(document).ready(function(){
    $.ajaxSetup({ cache: false });
    var myRand = getRandomInt(0, 99999999999);
    var increment=0;
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
                if (parseInt(res[1]) < (parseInt('1'+myRand+''+increment) - 3)) {
                    var $ht = $(allsuspects[i]);
                    //allsuspects[i].parentNode.removeChild(allsuspects[i]);
                    if($ht.length)
                    $ht.remove();
                    //allsuspects.splice(i, 1);
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
     
    setInterval(refreshCss, 500);
    function refreshCss(){
        var cssId = 'myCss';  // you could encode the css path itself to generate id..
        var removeCss = getCssToRemove("CommonWide","css");
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.id   = cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'http://static.vserver-eddie/production/css/812/CommonWide.css?1'+myRand+''+increment;
        link.media = 'all';
        increment++;
        head.appendChild(link);
        
    }
})
