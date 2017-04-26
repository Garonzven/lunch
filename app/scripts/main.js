$(document).ready(function() {
    $.ajax({
        url: "login.html",
        type: "get",
        dataType: "text",
        success: function(response) {
            $('.container').html(response);
        }
    });
});
