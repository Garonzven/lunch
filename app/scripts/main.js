jQuery.validator.setDefaults({
  debug: true,
  success: 'valid'
  });

$(document).ready(function() {
  $('#loginForm').validate({
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
          required: 'Please enter your password'
        },
        email:{
          required: 'Please enter your email',
          email: 'Please enter a correct email'
        }

      },

      submitHandler: function(form){
        $.ajax({
          url: 'http://13.92.198.201/laravel/public/login/signin',
          method: 'post',
          data: {
            email: $('#email').val(),
            password: $('#password').val()
          },
          dataType: 'JSON',
          success: function(data) {
            console.log(data);
            if (data.token) {
              $.cookie('token', data.token, { expires: 7 });
              switch (data.user.id_profile) {
                case 1:
                  $(location).attr('href', 'welcome.html');
                  break;

                case 2:

                  break;

                case 3:
                  break;
              }
            } else {
              alert('Invalid credentials!');
            }
          },
          error: function(res) {
            console.log(res);
          }
        });
      }
    });

});
