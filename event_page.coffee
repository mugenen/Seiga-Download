chrome.extension.onMessage.addListener (request, sender, sendResponse) ->
    if request.type == 'url'
        $.ajax(request.url).done (data, status) ->
            image_url = data.match('img src="(.*?)" data-watch_url.*')[1]
            sendResponse({image_url: image_url})
        .fail (data, status) ->
            sendResponse(null)
    else if request.type == 'filetype'
        filetype = ''
        $.ajax(request.url, {type: 'HEAD'}).done (data, status, jqXHR) ->
            if jqXHR.getResponseHeader('Content-Type') =='image/png'
                filetype = '.png'
            else if jqXHR.getResponseHeader('Content-Type') =='image/jpeg'
                filetype = '.jpg'
            else if jqXHR.getResponseHeader('Content-Type') =='image/gif'
                filetype = '.gif'
            sendResponse({image_type: filetype})
        .fail (data, status) ->
            sendResponse(null)
    else if request.type == 'download'
        chrome.downloads.download({url: request.url, filename: request.filename})
        sendResponse(null)
    else if request.type == 'filename_setting'
        sendResponse(localStorage['filename_setting'] ? '?member-name? - ?title?(?illust-id?)')
    true

