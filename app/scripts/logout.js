//'http://13.92.198.201/laravel/public/login/signout?token='+$.cookie('token'),
$('.logout').on('click', function() {
  $.ajax({
    url: 'http://localhost:8000/login/signout?token='+$.cookie('token'),
    method: 'POST',
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
