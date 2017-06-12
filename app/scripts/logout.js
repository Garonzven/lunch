$('.logout').on('click', function() {
  $.ajax({
    url: constants().logout + '?token='+$.cookie('token'),
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
