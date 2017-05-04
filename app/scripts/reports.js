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
      $('#report-detail').append('<tr><td align="center">'+formatday(data.initial_date)+'</td><td align="center">'+formatday(data.closing_date)+'</td><td align="center"><button type="button" class="btn btn--yellow print" onClick="printReport(this.id)" name="print" id="'+data.id+'" ><i class="glyphicon glyphicon-download-alt"></i></button></td></tr>');
    });
  $('#example').dataTable();
  }
});

function printReport(e){
  console.log(e);

  $.ajax({
    url: constants().cycleReport + '?token=' + $.cookie('token'),
    method:'PUT',
    data:{
      id : e
    },
    dataType:'JSON',
    success: function(){
      console.log(data);
    }
  });
}

$(document).ready(function(){


  $('.print').on('click',function(){
    swal({
      title: 'Are you sure?',
      text: 'There are some lunchers who haven\'t choose their dishes',
      imageUrl: 'assets/warning_1.png',
      imageWidth: 200,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Print'
    });
    });
  });
