chrome.extension.onMessage.addListener (request, sender, sendResponse) ->
    $.ajax(request.url).done (data, status) ->
        image_url = data.match('img src="(.*?)" data-watch_url.*')[1]
        sendResponse({image_url: image_url})
    .fail (data, status) ->
        sendResponse(null)
    true

