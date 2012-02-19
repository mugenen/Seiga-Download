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
    tag = document.querySelectorAll('#illust_main_top a')
    if tag.length > 0
        tag[1].getAttribute('href');
    else
        null

getImageTitle = () ->
    tag = document.querySelectorAll('.title_text')
    if tag.length > 0
        tag[0].textContent.replace(/^\s+/, '').replace(/\s+$/, '');
    else
        null

getImageCreator = () ->
    tag = document.querySelectorAll('.illust_user_name strong')
    if tag.length > 0
        tag[0].textContent;
    else
        null

getImageID = () ->
    document.URL.replace(/.*(im\d+).*/, '$1')

getFileName = () ->
    creator = getImageCreator()
    title = getImageTitle()
    id = getImageID()
    if creator? and title? and id?
        creator + ' - ' + title + '(' + id + ')'
    else
        null

download = (url, filename) ->
    () ->
        toClick = document.createElement('a');
        toClick.setAttribute('href', url);
        toClick.setAttribute('download', filename);
        dispatchMouseEvents({type:'click', altKey:false, target:toClick, button:0});
#        ‚ ‚Æ‚Å‘Î‰ž‚·‚é‚©‚à
#        document.querySelector('#SD img').setAttribute('src', chrome.extension.getURL('download2.png'));
        this.removeEventListener('click', arguments.callee);

addLink = (url, filename) ->
    img = document.createElement('img')
    img.setAttribute('src', chrome.extension.getURL('download.png'));

    a = document.createElement('a');
    a.appendChild(img);
    a.setAttribute('href', 'javascript:void(0);');
    a.addEventListener('click', download(url, filename), false);

    div = document.createElement('div');
    div.setAttribute('id', 'SD');
    div.appendChild(a);

    parent = document.querySelector('#illust_main_top td td');
    after = parent.querySelector('div');
    parent.insertBefore(div, after);


url = getImageURL()
filename = getFileName()

if url? and filename?
    addLink(url, filename)
else
    return

