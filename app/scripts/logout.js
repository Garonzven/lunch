$('.logout').on('click', function() {
  $.ajax({
    url: 'http://13.92.198.201/laravel/public/login/signout',
    method: 'post',
    data: {
      token: $.cookie('token')
    },
    success: function(data) {
      $(location).attr('href', 'login.html');
    }
  });
})
