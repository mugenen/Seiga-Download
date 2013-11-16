(function() {
  'use strict';
  var addLink, dispatchMouseEvents, download, filename, getFileName, getImageCreator, getImageID, getImagePageURL, getImageTitle, getImageType, getImageURL;

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

  getImagePageURL = function() {
    var tag;
    tag = $('#illust_link');
    if (tag.length > 0) {
      return tag.attr('href');
    } else {
      return null;
    }
  };

  getImageURL = function() {
    var dfd, url;
    dfd = $.Deferred();
    url = getImagePageURL();
    if (url != null) {
      chrome.extension.sendMessage({
        type: 'url',
        url: 'http://seiga.nicovideo.jp' + url
      }, function(response) {
        if (response != null) {
          return dfd.resolve('http://lohas.nicoseiga.jp' + response.image_url);
        } else {
          return dfd.reject();
        }
      });
    } else {
      dfd.reject();
    }
    return dfd.promise();
  };

  getImageType = function(url, filename) {
    var dfd;
    dfd = $.Deferred();
    if (filename.indexOf('.') === -1) {
      dfd.resolve('');
    } else if (url != null) {
      chrome.extension.sendMessage({
        type: 'filetype',
        url: url
      }, function(response) {
        if (response != null) {
          return dfd.resolve(response.image_type);
        } else {
          return dfd.reject();
        }
      });
    } else {
      dfd.reject();
    }
    return dfd.promise();
  };

  getImageTitle = function() {
    var tag;
    tag = $('h1.title');
    if (tag.length > 0) {
      return tag.text().trim();
    } else {
      return null;
    }
  };

  getImageCreator = function() {
    var tag;
    tag = $('.user_name strong');
    if (tag.length > 0) {
      return tag.text();
    } else {
      return null;
    }
  };

  getImageID = function() {
    return document.URL.replace(/.*?(im\d+).*/, '$1');
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

  addLink = function(url_dfd, filename) {
    var a, div, img, main, parent;
    img = $('<img>');
    img.attr('src', chrome.extension.getURL('download.png'));
    img.attr('draggable', false);
    a = $('<a>');
    a.append(img);
    a.attr('href', 'javascript:void(0);');
    main = function() {
      url_dfd.done(function(url) {
        return getImageType(url, filename).done(function(type) {
          return download(url, filename + type);
        });
      });
      return false;
    };
    a.one('click', main);
    div = $('<div>');
    div.attr('id', 'SD');
    div.append(a);
    parent = $('.thum_large').eq(0);
    return parent.prepend(div);
  };

  filename = getFileName();

  if (filename != null) addLink(getImageURL(), filename);

}).call(this);
