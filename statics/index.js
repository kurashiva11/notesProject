// var AllowNotification = false;

// $( function(e) {
//     function get_files(){
//         var files = $(".files").text();
//         files = files.replace(/\"/g, '\\\"').replace(/\\\'/g, '`');
//         files = files.replace(/\'/g, '"').replace(/\`/g, "'");
//         files = JSON.parse(files)
//         return files;
//     }

//     function reloadFiles(data){
//         $(".files").text( data.filter(".files").text() );
//         return get_files();
//     }

//     $(".fileDelete").click(function(e) {
//         e.stopPropagation();
//         var name = $(this).attr("id");

//         if(confirm("Are you sure you want to delete " + name + " permanently?")){
//             $.ajax({
//                 type: "post", // or "get"
//                 url: "deleteFile",
//                 data: {'name': name},
//                 headers: {'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()}, // for csrf token
//                 success: function(data) {
//                     location.reload();
//                 },
//                 error: function(e){
//                     alert("something went wrong");
//                     location.reload();
//                 }
//             });
//         }

//     });

//     $('.save-file').click(function() {
//         var textarea = $(".notepad");
//         var filename = $(".fileName");
//         filename.val( filename.val().trim() );
//         var temp = textarea.val();
//         textarea.val(temp);
//         var files = get_files();
//         var files_len = files.length;

//         $(".save-file").html('<span class="spinner-border spinner-border-sm nav-link"></span>' + " Saving");


//         $.ajax({
//             type: "post", // or "get"
//             url: "addFile",
//             data: {'filename': filename.val(), 'filedata': textarea.val()},
//             headers: {'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()}, // for csrf token
//             success: function(data) {
//                 location.reload();
//             },
//             error: function(e){
//                 alert("something went wrong");
//                 location.reload();
//             }
//         });
//     });
// });

function getFiles(callback) {
    $.ajax({
        type: "get",
        url: "getFiles",
        headers: {'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()}, // for csrf token
        success: function(data) {
            callback(data);
        },
        error: function(e){
            alert("something went wrong while retriving your files");
            console.log(e)
        }
    });
}

function update_file_in_tree(files) {
    for (file of files) {
        var file_struct = `<li>
        <a href="#" class='file' id='${file.name}'>${file.name} <span style="float:right;"><span class="mr-1 fileDelete" id="${file.name}"><i class="fa fa-trash" aria-hidden="true"></i></span></span> </a>
        </li>
        <div class="custom-menu">
        <li id="${file.name}" class="rename">rename</li>
        </div>`
        $(".components").append(file_struct)
    }
}

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

    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus');
    })

    if (is_authenticated) {
        getFiles(function (data) {      // will get executed on succesful login.
            update_file_in_tree(data);
        });

        $('.save-file').click(function() {
            var textarea = $(".notepad");
            var filename = $(".fileName");
            filename.val( filename.val().trim() );

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

        $(".components").on('click', '.fileDelete', function(e) {
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

        $(".components").on('click', '.file', function() {
            var name = $(this).text();
            console.log("clicked ", name);
            getFiles(function (files) {
                for (file of files) {
                    if (file["name"].trim() == name.trim()) {
                        $('.notepad').val(file["text"]);
                        $(".fileName").val(name);
                        break;
                    }
                }
            });
        });

    } else {
        // console.log("not authenticated")
    }
});