(function(){
  //Alt + Click
  //See: http://d.hatena.ne.jp/Griever/20100904/1283603283
  function dispatchMouseEvents(opt) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(opt.type, opt.canBubble||true, opt.cancelable||true, opt.view||window, 
                       opt.detail||0, opt.screenX||0, opt.screenY||0, opt.clientX||0, opt.clientY||0, 
                       opt.ctrlKey||false, opt.altKey||false, opt.shiftKey||false, opt.metaKey||false, 
                       opt.button||0, opt.relatedTarget||null);
    opt.target.dispatchEvent(evt);
    return evt;
  }
  //See: http://d.hatena.ne.jp/brazil/20070103/1167788352
  function absolutePath(path){
    var e = document.createElement('span');
    e.innerHTML = '<a href="' + path + '" />';
    return e.firstChild.href;
  }
  
  var images = document.getElementById("illust_main_top").getElementsByTagName("a");
  var imageURL = absolutePath(images[1].getAttribute("href"));

  var main = function(){
    var toClick = document.createElement("a");
    toClick.setAttribute("href", imageURL);
    dispatchMouseEvents({ type:'click', altKey:true, target:toClick, button:0 });
  };

  var root = document.getElementById("illust_main_top");
  var parent = root.getElementsByTagName("td")[0].getElementsByTagName("td")[0];
  var after = parent.getElementsByTagName("div")[0];
  var div = document.createElement("div");
  div.setAttribute("id", "SD");
  var a = document.createElement("a");
  var img = document.createElement("img")
  img.setAttribute("src", chrome.extension.getURL("download.png"));
  a.appendChild(img);
  a.setAttribute("href", "javascript:void(0);");
  var click = function(){
  	a.addEventListener("click", main, false);
  };
  click();
  div.appendChild(a);
  
  img.setAttribute("draggable", false)
  
  var drag = function(type) {
    a.addEventListener("dragstart", function (e) {
      var original = imageURL;
      var title = document.getElementsByClassName("title_text")[0].textContent.replace(/^\s+/, '').replace(/\s+$/, '');
      var creator = document.getElementsByClassName("illust_user_name")[0].getElementsByTagName("strong")[0].textContent;
      var id = document.URL.substring(document.URL.lastIndexOf("/") + 1);
      
      var filename = type + ":" + creator + " - " + title + "(" + id + ")" + ":" + original;
      console.log(filename);
      e.dataTransfer.setData("DownloadURL", filename);
    }, false);
  };
  
  var type = ""
  chrome.extension.sendRequest(imageURL, function(response, type) {
    type = response;
    drag(type);
    parent.insertBefore(div, after);
  });

})();
