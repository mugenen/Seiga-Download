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

getImageURL = () ->
    tag = $('#illust_main_top a:eq(1)')
    if tag.length > 0
        tag.attr('href');
    else
        null

getImageTitle = () ->
    tag = $('div.title_text')
    if tag.length > 0
        tag.text().trim();
    else
        null

getImageCreator = () ->
    tag = $('.illust_user_name strong')
    if tag.length > 0
        tag.text()
    else
        null

getImageID = () ->
    document.URL.replace(/.*(im\d+).*/, '$1')

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

addLink = (url, filename) ->
    img = $('<img>')
    img.attr('src', chrome.extension.getURL('download.png'));

    a = $('<a>')
    a.append(img);
    a.attr('href', 'javascript:void(0);');
    main = () ->
        download(url, filename)
#        ‚ ‚Æ‚Å‘Î‰ž‚·‚é‚©‚à
#        document.querySelector('#SD img').setAttribute('src', chrome.extension.getURL('download2.png'));
        false
    a.one('click', main);

    div = $('<div>');
    div.attr('id', 'SD');
    div.append(a);

    parent = $('#illust_main_top td td');
    parent.prepend(div);


url = getImageURL()
filename = getFileName()

if url? and filename?
    addLink(url, filename)
else
    return

