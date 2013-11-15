(function() {

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    $.ajax(request.url).done(function(data, status) {
      var image_url;
      image_url = data.match('img src="(.*?)" data-watch_url.*')[1];
      return sendResponse({
        image_url: image_url
      });
    }).fail(function(data, status) {
      return sendResponse(null);
    });
    return true;
  });

}).call(this);
