$( function(e) {
    $(document).ready(function () {
        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
        });
    });

    // simply disables save event for chrome
    $(window).keypress(function (event) {
        if (!(event.which == 115 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) && !(event.which == 19)) return true;
        event.preventDefault();
        return false;
    });

    // used to process the cmd+s and ctrl+s events
    $(document).keydown(function (event) {
        if (event.which == 83 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) {
            event.preventDefault();
            $('.save-file').click();
            return false;
        }
    });


    $('.file').click(function() {
        var name = $(this).text();
        var files = $(".files").text();
        files = files.replace(/\'/g, '"');
        files = JSON.parse(files)
        // console.log("json obj :", files)

        for(var i=0; i<files.length; i++){
            if(files[i]["name"].trim() == name.trim()){
                var temp = files[i].text.replace(/0xe20x800x80/g, "'");
                temp = temp.replace(/0xe20x800x81/g, '"');
                $('.notepad').val(temp);
                $(".fileName").val(name);
                break;
            }
        }
    });

    $(".fileDelete").click(function(e) {
        e.stopPropagation();
        var name = $(this).attr("id");
        console.log("file delete", name);

        if(confirm("Are you sure you want to delete " + name + " permanently?")){
            $.ajax({
                type: "post", // or "get"
                url: "deleteFile",
                data: {'name': name},
                headers: {'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()}, // for csrf token
                success: function(data) {
                    location.reload();
                }
            });
        }

    });

    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus');
    })

    $('.save-file').click(function() {
        var textarea = $(".notepad");
        var filename = $(".fileName");
        filename.val( filename.val().trim() );
        console.log(filename.val(), filename.val().length)
        var temp = textarea.val()
        temp = temp.replace(/\"/g, '\"');             //0xe20x800x81
        temp = temp.replace(/\'/g, "\'");               //0xe20x800x80
        textarea.val(temp);
    });
});