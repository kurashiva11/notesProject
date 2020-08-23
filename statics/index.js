var AllowNotification = false;

$( function(e) {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
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

    function get_files(){
        var files = $(".files").text();
        files = files.replace(/\"/g, '\\\"').replace(/\\\'/g, '`');
        files = files.replace(/\'/g, '"').replace(/\`/g, "'");
        files = JSON.parse(files)
        return files;
    }

    function reloadFiles(data){
        $(".files").text( data.filter(".files").text() );
        return get_files();
    }

    $('.file').click(function() {
        var name = $(this).text();
        var files = get_files();

        for(var i=0; i<files.length; i++){
            if(files[i]["name"].trim() == name.trim()){
                var temp = files[i].text;
                $('.notepad').val(temp);
                $(".fileName").val(name);
                break;
            }
        }
    });

    $(".fileDelete").click(function(e) {
        e.stopPropagation();
        var name = $(this).attr("id");

        if(confirm("Are you sure you want to delete " + name + " permanently?")){
            $.ajax({
                type: "post", // or "get"
                url: "deleteFile",
                data: {'name': name},
                headers: {'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()}, // for csrf token
                success: function(data) {
                    location.reload();
                },
                error: function(e){
                    alert("something went wrong");
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
        var temp = textarea.val();
        textarea.val(temp);
        var files = get_files();
        var files_len = files.length;

        $(".save-file").html('<span class="spinner-border spinner-border-sm nav-link"></span>' + " Saving");


        $.ajax({
            type: "post", // or "get"
            url: "addFile",
            data: {'filename': filename.val(), 'filedata': textarea.val()},
            headers: {'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()}, // for csrf token
            success: function(data) {
                location.reload();
            },
            error: function(e){
                alert("something went wrong");
                location.reload();
            }
        });
    });


    $(".setAlarm").click(function(e) {
        e.stopPropagation();
        $(".alarmModalBtn").click();
        console.log($(this).attr("id"));
        $(".alarmModalTitle").html($(this).attr("id"))
    });

    $(".addAlarm").click(function(e) {

        if($(".datetimepicker-input").val() != ""){
            var timetmp = moment($(".datetimepicker-input").val(), ["h:mm A"]).format("HH:mm").split(":");
            var tmpdate = new Date()
            tmpdate.setHours( parseInt(timetmp[0]) );
            tmpdate.setMinutes( parseInt(timetmp[1]) );

            var secs_to_notify = tmpdate.getTime()/1000 - (new Date()).getTime()/1000;
            secs_to_notify = Math.floor(secs_to_notify);
            console.log(secs_to_notify);

            $.ajax({
                type: "post",
                url: "setalaram/timeBased",
                data: {"time" : 10, "file_name": $(".alarmModalTitle").html()},
                headers: {'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()}, // for csrf token
                success: function(data){
                    console.log("alarm added successfully.")
                },
                error: function(e){
                    console.log("something went wrong while adding alarm");
                }
            });

        }


    });
});
