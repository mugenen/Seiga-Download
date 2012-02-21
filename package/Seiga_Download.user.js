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
    tag = document.querySelectorAll('#illust_main_top a');
    if (tag.length > 0) {
      return tag[1].getAttribute('href');
    } else {
      return null;
    }
  };

  getImageTitle = function() {
    var tag;
    tag = document.querySelectorAll('.title_text');
    if (tag.length > 0) {
      return tag[0].textContent.replace(/^\s+/, '').replace(/\s+$/, '');
    } else {
      return null;
    }
  };

  getImageCreator = function() {
    var tag;
    tag = document.querySelectorAll('.illust_user_name strong');
    if (tag.length > 0) {
      return tag[0].textContent;
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
      return creator + ' - ' + title + '(' + id + ')';
    } else {
      return null;
    }
  };

  download = function(url, filename) {
    var toClick;
    toClick = document.createElement('a');
    toClick.setAttribute('href', url);
    toClick.setAttribute('download', filename);
    return dispatchMouseEvents({
      type: 'click',
      altKey: false,
      target: toClick,
      button: 0
    });
  };

  addLink = function(url, filename) {
    var a, after, div, img, main, parent;
    img = document.createElement('img');
    img.setAttribute('src', chrome.extension.getURL('download.png'));
    a = document.createElement('a');
    a.appendChild(img);
    a.setAttribute('href', 'javascript:void(0);');
    main = function() {
      download(url, filename);
      return this.removeEventListener('click', main);
    };
    a.addEventListener('click', main, false);
    div = document.createElement('div');
    div.setAttribute('id', 'SD');
    div.appendChild(a);
    parent = document.querySelector('#illust_main_top td td');
    after = parent.querySelector('div');
    return parent.insertBefore(div, after);
  };

  url = getImageURL();

  filename = getFileName();

  if ((url != null) && (filename != null)) {
    addLink(url, filename);
  } else {
    return;
  }

}).call(this);
