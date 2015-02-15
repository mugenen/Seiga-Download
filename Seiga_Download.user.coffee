'use strict';

getImagePageURL = () ->
    tag = $('#illust_link')
    if tag.length > 0
        tag.attr('href');
    else
        null

getImageURL = () ->
    dfd = $.Deferred()
    url = getImagePageURL()
    if url?
        chrome.extension.sendMessage {type: 'url', url: 'http://seiga.nicovideo.jp' + url}, (response) ->
            if response?
                dfd.resolve('http://lohas.nicoseiga.jp' + response.image_url)
            else
                dfd.reject()
    else
        dfd.reject()
    dfd.promise()

getImageType = (url) ->
    dfd = $.Deferred()
    if url?
        chrome.extension.sendMessage {type: 'filetype', url: url}, (response) ->
            if response?
                dfd.resolve(response.image_type)
            else
                dfd.reject()
    else
        dfd.reject()
    dfd.promise()

getImageTitle = () ->
    tag = $('h1.title')
    if tag.length > 0
        tag.text().trim();
    else
        null

getImageCreator = () ->
    tag = $('.user_name strong').eq(0)
    if tag.length > 0
        tag.text()
    else
        null

getImageCreatorID = () ->
    tag = $('.user_name a').eq(0)
    if tag.length > 0
        tag.attr('href').split('/').pop()
    else
        null

getImageID = () ->
    document.URL.replace(/.*?(im\d+).*/, '$1')

getFileNameSetting = () ->
    dfd = $.Deferred()
    chrome.extension.sendMessage {type: 'filename_setting'}, (response) ->
        dfd.resolve(response)
    dfd.promise()

getFileName = () ->
    creator = getImageCreator()
    creatorID = getImageCreatorID()
    title = getImageTitle()
    id = getImageID()
    data =
        'member-name': creator
        'member-id': creatorID
        'title': title
        'illust-id': id
    if creator? and creatorID and title? and id?
        getFileNameSetting().pipe (filename_setting) -> filename_setting.replace(
            /\?(.+?)\?/g,
            (match, group) -> data[group]
        )
    else
        dfd = $.Deferred()
        dfd.reject()

download = (url, filename) ->
    chrome.extension.sendMessage {type: 'download', url: url, filename: filename}

addLink = (url_dfd, filename) ->
    img = $('<img>')
    img.attr('src', chrome.extension.getURL('download.png'));
    img.attr('draggable', false)
    
    a = $('<a>')
    a.append(img);
    a.attr('href', 'javascript:void(0);');
    main = () ->
        url_dfd.done (url) ->
            getImageType(url).done (type) ->
                download(url, filename + type)
#                document.querySelector('#SD img').setAttribute('src', chrome.extension.getURL('download2.png'));
        false
    a.one('click', main);

    div = $('<div>');
    div.attr('id', 'SD');
    div.append(a);

    parent = $('.thum_large').eq(0);
    parent.prepend(div);

getFileName().done (filename) ->
    if filename?
        addLink(getImageURL(), filename)


getImageURL_old = () ->
    tag = $('#illust_main_top a:eq(1)')
    if tag.length > 0
        'http://seiga.nicovideo.jp/' + tag.attr('href');
    else
        null

getImageTitle_old = () ->
    tag = $('div.title_text')
    if tag.length > 0
        tag.text().trim();
    else
        null

getImageCreator_old = () ->
    tag = $('.illust_user_name strong')
    if tag.length > 0
        tag.text()
    else
        null

getImageCreatorID_old = () ->
    tag = $('.illust_user_name a').eq(0)
    if tag.length > 0
        tag.attr('href').split('/').pop().split('?')[0]
    else
        null

getImageID_old = () ->
    document.URL.replace(/.*?(im\d+).*/, '$1')

getFileName_old = () ->
    creator = getImageCreator_old()
    creatorID = getImageCreatorID_old()
    title = getImageTitle_old()
    id = getImageID_old()
    data =
        'member-name': creator
        'member-id': creatorID
        'title': title
        'illust-id': id
    if creator? and creatorID and title? and id?
        getFileNameSetting().pipe (filename_setting) -> filename_setting.replace(
            /\?(.+?)\?/g,
            (match, group) -> data[group]
        )
    else
        dfd = $.Deferred()
        dfd.reject()

addLink_old = (url, filename) ->
    img = $('<img>')
    img.attr('src', chrome.extension.getURL('download.png'));

    a = $('<a>')
    a.append(img);
    a.attr('href', 'javascript:void(0);');
    main = () ->
        getImageType(url).done (type) ->
            download(url, filename + type)
        false
    a.one('click', main);

    div = $('<div>');
    div.attr('id', 'SD');
    div.append(a);

    parent = $('#illust_main_top td td').eq(0);
    parent.prepend(div);


url = getImageURL_old()
getFileName_old().done (filename) ->
    if url? and filename?
        addLink_old(url, filename)
