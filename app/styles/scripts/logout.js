$('.logout').on('click', function() {
  $.ajax({
    url: 'http://13.92.198.201/laravel/public/login/signout?token='+$.cookie('token'),
    method: 'PUT',
    dataType:'JSON',
    success: function(data) {
      $(location).attr('href', 'login.html');
    },
    error: function(data){
      console.log(data);
      $(location).attr('href','index.html');
    }
  });
})
