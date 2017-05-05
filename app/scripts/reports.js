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



function printAlert(e){
  e.preventDefault;
  var id= $(e).attr('id');
  console.log(id);
  swal({
  title: 'Are you sure?',
  text: "There are some lunchers who haven't choose their menus!",
  imageUrl:"assets/warning_1.png",
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Print'
}).then(function () {
  window.location.href = constants().cycleReport +'/'+id+'?token=' + $.cookie('token');
})
}

$.ajax({
  url: constants().cycleList + '?token='+$.cookie('token'),
  method: 'GET',
  dataType: 'JSON',
  success: function(data){
    console.log(data);
    print="";
    $.each(data.data, function (key, data) {
      if(data.remaining){
        print = "onClick=printAlert(this)";
      }else{
        print = 'href="'+constants().cycleReport +'/'+data.id+'?token=' + $.cookie('token')+'"';
      }
      $('#report-detail').append('<tr><td align="center">'+formatday(data.initial_date)+'</td><td align="center">'+formatday(data.closing_date)+'</td><td align="center"><a class="btn btn--yellow print" '+print+' name="print" id="'+data.id+'"><i class="glyphicon glyphicon-download-alt"></i></a></td></tr>');
    });
  $('#example').dataTable();
  }
});
