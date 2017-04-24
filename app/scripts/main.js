$(document).ready(function() {
    $.ajax({
        url: 'login.html',
        type: 'get',
        dataType: 'text',
        success: function(response) {
          $('.container').html(response);
          $('#login').on('click', function() {
            $.ajax({
              url:'http://127.0.0.1:8000/login/signin',
              method:'post',
              data: {email:$('#email').val(),password:$('#password').val()},
              dataType:'JSON',
              success: function(data){
                  $.ajax({
                    url:'user_dashboard.html',
                    type:'get',
                    dataType: 'text',
                    success: function(data2) {
                      $('.container').html(data2);
                      $('#name').html(data.name);
                      $.ajax({
                        url:'avatar.html',
                        type:'get',
                        dataType:'text',
                        success:function(response){
                            $('.avatar').html(response);
                        }
                      });
                    }
                  });
              }
            });
          });
        }
    });
      // $.ajax({
      //     url: 'user_dashboard.html',
      //     type: 'get',
      //     dataType: 'text',
      //     success: function(response) {
      //         $('.container').html(response);
      //     }
      // });
});
