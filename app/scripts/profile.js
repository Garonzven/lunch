$('.navContainer__logo').addClass('navContainer__logo--center');


function viewRole(id){
  switch (id) {
    case 1:
    return 'Administrator';
    break;
    case 2:
    return 'User';
    break;
    case 3:
    return 'Watcher';
    break;
  }
}

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
        $('#p-id_profile').text(viewRole(data.user.id_profile));
        $('.p-name').text(data.user.name);
        switch (data.user.id_profile) {
          case 1:
            $('.sidebar-nav').load('menu_admin.html');
            break;

          case 2:
            $('.sidebar-nav').load('menu_user.html');
            break;

          case 3:
            $('.sidebar-nav').load('menu_watcher.html');
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
      required:true,
      equalTo: '#passwordp'
    }
  },
  submitHandler: function(form) {
    console.log($('#passwordp').val());

    $.ajax({
      url: constants().change + '?token=' + $.cookie('token'),
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
      },
      error: function(response){
        swal({
        text: data.message+'!',
        imageUrl:'assets/error.png',
        confirmButtonText: 'Ok'
        }).then(
          function(){
             setTimeout(function () { location.reload(true); }, 100);
          }
        );
      }
  });
}
});
