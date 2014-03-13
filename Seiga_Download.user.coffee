'use strict';
dispatchMouseEvents = (opt) ->
    ###
    Alt + Click
    See: http://d.hatena.ne.jp/Griever/20100904/1283603283
    ###
    evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(opt.type, opt.canBubble||true, opt.cancelable||true, opt.view||window, 
                       opt.detail||0, opt.screenX||0, opt.screenY||0, opt.clientX||0, opt.clientY||0, 
                       opt.ctrlKey||false, opt.altKey||false, opt.shiftKey||false, opt.metaKey||false, 
                       opt.button||0, opt.relatedTarget||null);
    opt.target.dispatchEvent(evt);

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

getImageType = (url, filename) ->
    dfd = $.Deferred()
    if filename.indexOf('.') == -1
        dfd.resolve('')
    else if url?
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

getImageID = () ->
    document.URL.replace(/.*?(im\d+).*/, '$1')

getFileName = () ->
    creator = getImageCreator()
    title = getImageTitle()
    id = getImageID()
    if creator? and title? and id?
        "#{creator} - #{title}(#{id})"
    else
        null

download = (url, filename) ->
    toClick = $('<a>')
    toClick.attr('href', url);
    toClick.attr('download', filename);
    dispatchMouseEvents({type:'click', altKey:false, target:toClick.get(0), button:0});

addLink = (url_dfd, filename) ->
    img = $('<img>')
    img.attr('src', chrome.extension.getURL('download.png'));
    img.attr('draggable', false)
    
    a = $('<a>')
    a.append(img);
    a.attr('href', 'javascript:void(0);');
    main = () ->
        url_dfd.done (url) ->
            getImageType(url, filename).done (type) ->
                download(url, filename + type)
#                document.querySelector('#SD img').setAttribute('src', chrome.extension.getURL('download2.png'));
        false
    a.one('click', main);

    div = $('<div>');
    div.attr('id', 'SD');
    div.append(a);

    parent = $('.thum_large').eq(0);
    parent.prepend(div);

filename = getFileName()

if filename?
    addLink(getImageURL(), filename)


getImageURL_old = () ->
    tag = $('#illust_main_top a:eq(1)')
    if tag.length > 0
        tag.attr('href');
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

getImageID_old = () ->
    document.URL.replace(/.*?(im\d+).*/, '$1')

getFileName_old = () ->
    creator = getImageCreator_old()
    title = getImageTitle_old()
    id = getImageID_old()
    if creator? and title? and id?
        "#{creator} - #{title}(#{id})"
    else
        null

addLink_old = (url, filename) ->
    img = $('<img>')
    img.attr('src', chrome.extension.getURL('download.png'));

    a = $('<a>')
    a.append(img);
    a.attr('href', 'javascript:void(0);');
    main = () ->
        download(url, filename)
        false
    a.one('click', main);

    div = $('<div>');
    div.attr('id', 'SD');
    div.append(a);

    parent = $('#illust_main_top td td').eq(0);
    parent.prepend(div);


url = getImageURL_old()
filename = getFileName_old()

if url? and filename?
    addLink_old(url, filename)
