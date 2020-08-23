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
        files = JSON.parse(files);

        console.log(files[0].name , "clicked a file from 33 ", name);

        for(var i=0; i<files.length; i++){
            if(files[i].name == name){
                $('.notepad').text(files[i].text);
                break;
            }
        }
    });

    $(".fileDelete").click(function(e) {
        e.stopPropagation();
        console.log("file delete")
        var name = $(this).text()

        $.ajax("/deleteFile", {
            type: "post", // or "get"
            data: name,
            headers: {'X-CSRFToken': '{{ csrf_token }}'}, // for csrf token
            success: function(data) {
                console.log("success")
            }
        });
    });

    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus');
    })

    $('.save-file').click(function() {
        var textarea = $(".notepad");
        var filename = $(".fileName");
        textarea = textarea.replace(/\'/g, "\\\'")
        textarea = textarea.replace(/\"/g, "\\\"")
        if(textarea.text() == "" || filename==""){
            alert("please enter both file name and file data")
        }
    });
});