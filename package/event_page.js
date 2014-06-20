(function() {

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var filetype;
    if (request.type === 'url') {
      $.ajax(request.url).done(function(data, status) {
        var image_url;
        image_url = data.match('img src="(.*?)" data-watch_url.*')[1];
        return sendResponse({
          image_url: image_url
        });
      }).fail(function(data, status) {
        return sendResponse(null);
      });
    } else if (request.type === 'filetype') {
      filetype = '';
      $.ajax(request.url, {
        type: 'HEAD'
      }).done(function(data, status, jqXHR) {
        if (jqXHR.getResponseHeader('Content-Type') === 'image/png') {
          filetype = '.png';
        } else if (jqXHR.getResponseHeader('Content-Type') === 'image/jpeg') {
          filetype = '.jpg';
        } else if (jqXHR.getResponseHeader('Content-Type') === 'image/gif') {
          filetype = '.gif';
        }
        return sendResponse({
          image_type: filetype
        });
      }).fail(function(data, status) {
        return sendResponse(null);
      });
    } else if (request.type === 'download') {
      chrome.downloads.download({
        url: request.url,
        filename: request.filename
      });
      sendResponse(null);
    }
    return true;
  });

}).call(this);
