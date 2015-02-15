$( ->
    localStorage['filename_setting'] ?= '?member-name? - ?title?(?illust-id?)'
    saveOptions = ->
        saveOption = (name) ->
            localStorage[name] = $("##{name}").val()

        saveOption('filename_setting');

    restoreOptions = ->
        selectOption = (name) ->
            option = localStorage[name];
            if option?
                $("##{name}").val(option)

        selectOption('filename_setting');

    restoreOptions()
    $("#save").click(-> saveOptions())
);
