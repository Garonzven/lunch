// Load profile
$.ajax({
  url: constants().server + constants().profile + '?token=' + $.cookie('token'),
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
            console.log("hola");
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
