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
  
  
  var main = function(){
    var images = document.getElementById("illust_main_top").getElementsByTagName("a");
    var toClick = document.createElement("a");
    toClick.setAttribute("href", images[1].getAttribute("href"));
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
  parent.insertBefore(div, after);
})();
