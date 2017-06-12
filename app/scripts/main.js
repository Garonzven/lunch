$('#loginForm').validate({
  rules: {
    password: {
      required: true
    },
    email: {
      required: true,
      email: true
    }
  },
  messages: {
    password: {
      required: 'Please enter your password'
    },
    email: {
      required: 'Please enter your email',
      email: 'Please enter a correct email'
    }
  },
  submitHandler: function(form) {
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
              if (data.user.change_pass) {
                $(location).attr('href', 'reset_password.html');
                $.cookie('id_profile', data.user.id_profile);
              } else {
                $(location).attr('href', 'welcome.html');
              }
              break;

            case 2:
              if (data.user.change_pass) {
                $(location).attr('href', 'reset_password.html');
                $.cookie('id_profile', data.user.id_profile);
              } else {
                $(location).attr('href', 'menu_select.html');
              }
              break;

            case 3:
              if (data.user.change_pass) {
                $(location).attr('href', 'reset_password.html');
                $.cookie('id_profile', data.user.id_profile);
              } else {
                 $(location).attr('href', 'menu_select.html');
              }
          }
        } else {
          swal({
            text: data.code == '401' ? 'Invalid credentials' : 'An internal error occurred, please try again',
            imageUrl: 'assets/error.png',
            confirmButtonText: 'Ok'
          }).then(function() {
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
$('#resetForm').validate({
  rules: {
    resetemail: {
      required: true,
      email: true
    }
  },
  submitHandler: function(form) {
    $.ajax({
      url: constants().recovery + '?token=' + $.cookie('token'),
      method: 'PUT',
      data: {
        email: $('#resetemail').val()
      },
      dataType: 'JSON',
      success: function(data) {
        console.log(data);
        switch (data.code) {
          case '200':
          swal({
            text: data.message,
            imageUrl: 'assets/check-mail.png',
            confirmButtonText: 'Ok'
          }).then(function() {
            setTimeout(function () { location.reload(true); }, 100);
          });
          break;

          case '404':
            swal({
              text: 'The mail entered does not exist',
              imageUrl: 'assets/error.png',
              confirmButtonText: 'Ok'
            });
        }
      }
    });
  }
});
