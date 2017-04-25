$(document).ready(function() {
    $("#loginForm").validate({
      rules: {
        // simple rule, converted to {required:true}
        password: {
          required:true
        },
        // compound rule
        email: {
          required: true,
          email: true
        }
      },

      messages:{
        password:{
          required: "Please enter your password"
        },
        email:{
          required: "Please enter your email",
          email: "Please enter a correct email"
        }

      },

      submitHandler: function(form){
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
      }
    });
});
