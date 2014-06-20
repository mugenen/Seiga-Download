(function() {
  'use strict';
  var addLink, addLink_old, download, filename, getFileName, getFileName_old, getImageCreator, getImageCreator_old, getImageID, getImageID_old, getImagePageURL, getImageTitle, getImageTitle_old, getImageType, getImageURL, getImageURL_old, url;

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

  getImageType = function(url) {
    var dfd;
    dfd = $.Deferred();
    if (url != null) {
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
    tag = $('.user_name strong').eq(0);
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
    return chrome.extension.sendMessage({
      type: 'download',
      url: url,
      filename: filename
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
        return getImageType(url).done(function(type) {
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

  getImageURL_old = function() {
    var tag;
    tag = $('#illust_main_top a:eq(1)');
    if (tag.length > 0) {
      return 'http://seiga.nicovideo.jp/' + tag.attr('href');
    } else {
      return null;
    }
  };

  getImageTitle_old = function() {
    var tag;
    tag = $('div.title_text');
    if (tag.length > 0) {
      return tag.text().trim();
    } else {
      return null;
    }
  };

  getImageCreator_old = function() {
    var tag;
    tag = $('.illust_user_name strong');
    if (tag.length > 0) {
      return tag.text();
    } else {
      return null;
    }
  };

  getImageID_old = function() {
    return document.URL.replace(/.*?(im\d+).*/, '$1');
  };

  getFileName_old = function() {
    var creator, id, title;
    creator = getImageCreator_old();
    title = getImageTitle_old();
    id = getImageID_old();
    if ((creator != null) && (title != null) && (id != null)) {
      return "" + creator + " - " + title + "(" + id + ")";
    } else {
      return null;
    }
  };

  addLink_old = function(url, filename) {
    var a, div, img, main, parent;
    img = $('<img>');
    img.attr('src', chrome.extension.getURL('download.png'));
    a = $('<a>');
    a.append(img);
    a.attr('href', 'javascript:void(0);');
    main = function() {
      getImageType(url).done(function(type) {
        return download(url, filename + type);
      });
      return false;
    };
    a.one('click', main);
    div = $('<div>');
    div.attr('id', 'SD');
    div.append(a);
    parent = $('#illust_main_top td td').eq(0);
    return parent.prepend(div);
  };

  url = getImageURL_old();

  filename = getFileName_old();

  if ((url != null) && (filename != null)) addLink_old(url, filename);

}).call(this);
