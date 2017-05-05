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
        $.ajax({
          url: 'menu_admin.html',
          method: 'get',
          dataType: 'text',
          success: function(data) {
            $('.sidebar-nav').html(data);

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

function formatday(date){
  var d = new Date(date);
  var n = d.getMonth()+'-'+d.getDate()+'-'+d.getFullYear();
  return n;
}

$.ajax({
  url: constants().cycleList + '?token='+$.cookie('token'),
  method: 'GET',
  dataType: 'JSON',
  success: function(data){
    console.log(data);
    $.each(data.data, function (key, data) {
      $('#report-detail').append('<tr><td align="center">'+formatday(data.initial_date)+'</td><td align="center">'+formatday(data.closing_date)+'</td><td align="center"><a class="btn btn--yellow print" href="'+constants().cycleReport +'/'+data.id+'?token=' + $.cookie('token')+'" name="print" id="'+data.id+'" ><i class="glyphicon glyphicon-download-alt"></i></a></td></tr>');
    });
  $('#example').dataTable();
  }
});
