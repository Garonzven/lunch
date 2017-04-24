$(document).ready(function() {
  $("#login").on("click", function() {
    $.ajax({
      url: "login.json",
      method: "get",
      data: {
        email: $("#email").val(),
        password: $("#password").val()
      },
      dataType: "JSON",
      success: function(data) {
        if (data.token) {
          $.cookie("token", data.token, { expires: 7 });
          $(location).attr("href", "user_dashboard.html");
        } else {
          alert("Invalid credentials!");
        }
      }
    });
  });
});
