function LoadHome(){
  $.ajax({
    url: constants().profile + '?token=' + $.cookie('token'),
    method: 'get',
    dataType: 'json',
    success: function(data) {
      switch (data.code) {
        case '200':
          switch (data.user.id_profile) {
            case 1:
              $(location).attr('href', 'welcome.html');
              break;

            case 2:
              $(location).attr('href', 'menu_select.html');
              break;

            case 3:
            break;
          }
          break;
      }
    },
    error: function(error) {
      console.log(error);
      switch (error.status) {
        case 401:
          $(location).attr('href', 'login.html');
          break;
      }
    }
  });
}

jQuery.validator.setDefaults({
  debug: true,
  success: "valid"
});
$("#myform").validate({
  rules: {
    password: {
      required: true,
      minlength: 6
    },
    confirmpassword: {
      equalTo: "#password"
    }
  },
  submitHandler: function(form) {
    //http://13.92.198.201/laravel/public/user/change?token="+$.cookie('token')
    $.ajax({
      url:"http://127.0.0.1:8000/user/change?token="+$.cookie('token'),
      method: "put",
      data:{
        password:$("#password").val()
      },
      dataType:"JSON",
      success: function(data){
        console.log(data);
        switch (data.code) {
          case "200":
            swal({
            text: data.message+"!",
            type: 'success',
            confirmButtonText: 'Ok'
          });
          LoadHome();
          break;
          case "400":
            swal({
            text: data.message+"!",
            type: 'success',
            confirmButtonText: 'Ok'
            });
          break;
        }
      }
  });
}
});
