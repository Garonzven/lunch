$('.logout').on('click', function() {
  $.ajax({
    url: 'http://13.92.198.201/laravel/public/login/signout?token='+$.cookie('token'),
    method: 'POST',
    dataType:'JSON',
    success: function(data) {
      console.log(data);
    },
    error: function(response){
      $(location).attr('href', 'login.html');
    }
  });
})
