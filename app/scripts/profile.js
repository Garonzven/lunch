$('.navContainer__logo').addClass('navContainer__logo--center');

// Load profile
$.ajax({
  url: constants().profile + '?token=' + $.cookie('token'),
  method: 'get',
  dataType: 'json',
  success: function(data) {
    switch (data.code) {
      case '200':
        $('#fullname').text(data.user.name);
        $('#p-email').text(data.user.email);
        $('#p-phone').text(data.user.phone);
        $('#p-jobtitle').text(data.user.jobtitle);
        $('#p-city').text(data.user.city);
        $('#p-country').text(data.user.country);
        $('#p-id_profile').text(data.user.id_profile);
        $('.p-name').text(data.user.name);
        console.log(data.user);
        $.ajax({
          url: 'menu_admin.html',
          method: 'get',
          dataType: 'text',
          success: function(data) {
            $('.sidebar-nav').html(data);
            console.log('hola');
          }
        });
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


$('#change_pass').on('click', function(){
  $('#p-password').addClass('hide-btn').removeClass('show-btn');
  $('#change-true').addClass('show-btn').removeClass('hide-btn');
});

jQuery.validator.setDefaults({
  debug: true,
  success: 'valid',
  highlight: function(element) {

        $(element).closest('.form-group').addClass('has-error');

    },
    unhighlight: function(element) {

        $(element).closest('.form-group').removeClass('has-error');

    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});

$('#myform').validate({
  rules: {
    passwordp: {
      required: true,
      minlength: 6
    },
    confirmpasswordp: {
      equalTo: 'passwordp'
    }
  },
  submitHandler: function(form) {
    console.log($('#passwordp').val());

    $.ajax({
      url:'http://13.92.198.201/laravel/public/user/change?token='+$.cookie('token'),
      method: 'put',
      data:{
        password:$('#passwordp').val()
      },
      dataType:'JSON',
      success: function(data){
        console.log(data);
        switch (data.code) {
          case '200':
            swal({
            text: data.message+'!',
            imageUrl:'assets/Congratulations.png',
            confirmButtonText: 'Ok'
            }).then(
              function(){
                 setTimeout(function () { location.reload(true); }, 100);
              }
            );
          break;
          case '400':
            swal({
            text: data.message+'!',
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
