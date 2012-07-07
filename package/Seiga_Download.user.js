(function() {
  'use strict';
  var addLink, dispatchMouseEvents, download, filename, getFileName, getImageCreator, getImageID, getImageTitle, getImageURL, url;

  dispatchMouseEvents = function(opt) {
    /*
        Alt + Click
        See: http://d.hatena.ne.jp/Griever/20100904/1283603283
    */
    var evt;
    evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(opt.type, opt.canBubble || true, opt.cancelable || true, opt.view || window, opt.detail || 0, opt.screenX || 0, opt.screenY || 0, opt.clientX || 0, opt.clientY || 0, opt.ctrlKey || false, opt.altKey || false, opt.shiftKey || false, opt.metaKey || false, opt.button || 0, opt.relatedTarget || null);
    return opt.target.dispatchEvent(evt);
  };

  getImageURL = function() {
    var tag;
    tag = $('#illust_main_top a:eq(1)');
    if (tag.length > 0) {
      return tag.attr('href');
    } else {
      return null;
    }
  };

  getImageTitle = function() {
    var tag;
    tag = $('div.title_text');
    if (tag.length > 0) {
      return tag.text().trim();
    } else {
      return null;
    }
  };

  getImageCreator = function() {
    var tag;
    tag = $('.illust_user_name strong');
    if (tag.length > 0) {
      return tag.text();
    } else {
      return null;
    }
  };

  getImageID = function() {
    return document.URL.replace(/.*(im\d+).*/, '$1');
  };

  getFileName = function() {
    var creator, id, title;
    creator = getImageCreator();
    title = getImageTitle();
    id = getImageID();
    if ((creator != null) && (title != null) && (id != null)) {
      return "" + creator + " - " + title + "(" + id + ")";
    } else {
      return null;
    }
  };

  download = function(url, filename) {
    var toClick;
    toClick = $('<a>');
    toClick.attr('href', url);
    toClick.attr('download', filename);
    return dispatchMouseEvents({
      type: 'click',
      altKey: false,
      target: toClick.get(0),
      button: 0
    });
  };

  addLink = function(url, filename) {
    var a, div, img, main, parent;
    img = $('<img>');
    img.attr('src', chrome.extension.getURL('download.png'));
    a = $('<a>');
    a.append(img);
    a.attr('href', 'javascript:void(0);');
    main = function() {
      download(url, filename);
      return false;
    };
    a.one('click', main);
    div = $('<div>');
    div.attr('id', 'SD');
    div.append(a);
    parent = $('#illust_main_top td td').eq(0);
    return parent.prepend(div);
  };

  url = getImageURL();

  filename = getFileName();

  if ((url != null) && (filename != null)) {
    addLink(url, filename);
  } else {
    return;
  }

}).call(this);
