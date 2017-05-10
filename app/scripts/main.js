
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
          url: constants().login,
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
                  if(data.user.change_pass){
                      $(location).attr('href', 'reset_password.html');
                      $.cookie('id_profile',data.user.id_profile);
                    }else{
                       $(location).attr('href', 'welcome.html');
                    }
                  break;

                case 2:
                  if(data.user.change_pass){
                      $(location).attr('href', 'reset_password.html');
                      $.cookie('id_profile',data.user.id_profile);
                    }else{
                       $(location).attr('href', 'menu_select.html');
                    }
                break;

                case 3:
                if(data.user.change_pass){
                    $(location).attr('href', 'reset_password.html');
                    $.cookie('id_profile',data.user.id_profile);
                  }else{
                     $(location).attr('href', 'menu_select.html');
                  }
                break;
                break;
              }
            } else {

              swal({
                text: data.message,
                imageUrl:'assets/error.png',
                confirmButtonText: 'Ok'

              }).then(function(){
                $('#email').focus();
              });

            }
          },
          error: function(res) {
            console.log(res);
          }
        });
      }
    });

});

jQuery.validator.setDefaults({
  debug: true,
  success: 'valid'
});
$('#resetForm').validate({
  rules: {
    resetemail: {
      required:true,
      email: true
    }
  },
  submitHandler: function(form) {
    //http://13.92.198.201/laravel/public/recovery
    $.ajax({
      url:'http://13.92.198.201/laravel/public/recovery',
      method: 'PUT',
      data:{
        email:$('#resetemail').val()
      },
      dataType:'JSON',
      success: function(data){
        console.log(data);
        switch (data.code) {
          case '200':
            swal({
            text: data.message,
            imageUrl:'assets/check-mail.png',
            confirmButtonText: 'Ok'
          }).then(
            function(){
               setTimeout(function () { location.reload(true); }, 100);
            }
          );
          break;

          case '404':
          swal({
          text: 'The mail entered does not exist',
          imageUrl:'assets/error.png',
          confirmButtonText: 'Ok'
          }).then(
            function(){
               setTimeout(function () { location.reload(true); }, 100);
            }
          );
          break;
        }
      }

    });

  }

});
