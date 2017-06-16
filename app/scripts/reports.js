$('.navContainer__logo').addClass('navContainer__logo--center');
var today;
$.ajax({
  url:constants().dateServer,
  method: 'GET',
  async: false,
  dataType: 'json',
  success: function(data){
    today = data.date;
  }
});

function GetDate() {
  return false;
}
// Load profile
$.ajax({
  url: constants().profile + '?token=' + $.cookie('token'),
  method: 'get',
  dataType: 'json',
  success: function(data) {
    switch (data.code) {
      case '200':
        $('#fullname').text(data.user.name);
        $('.full-name').text(data.user.name);
        switch (data.user.id_profile) {
          case 1:
            $('.sidebar-nav').load('menu_admin.html');
            break;

          case 2:
            $('.sidebar-nav').load('menu_user.html');
            break;

          case 3:
            $('.sidebar-nav').load('menu_watcher.html');
            break;
        }
        break;

      case '400':
        $(location).attr('href', 'login.html');
        break;
    }
  }
});

// Depricated
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
  text: 'There are some lunchers who haven\'t choose their menus!',
  imageUrl:'assets/warning_1.png',
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
    var print = '';
    // var dateserver = GetDate();
    // var server =  moment(dateserver);
    // var limit =  moment(data.limit_date);
    var disable;
    $.each(data.data, function (key, data) {
      /*if(data.remaining){
        print = "onClick=printAlert";
      }else{*/
      disable = 'disable-link';
      console.log(data.initial_date, data.closing_date, data.limit_date, moment(today).diff(moment(data.limit_date), 'days'));
      if (moment(today).diff(moment(data.limit_date)) > 0) {
        disable = '';
      }
        print = 'href="'+constants().cycleReport +'/'+data.id+'?token=' + $.cookie('token')+'"';
      //}
      $('#report-detail').append('<tr><td align="center">'+moment(data.initial_date).format('YYYY-MM-DD')+'</td><td align="center">'+moment(data.closing_date).format('YYYY-MM-DD')+'</td><td align="center">'+moment(data.limit_date).format('YYYY-MM-DD')+'</td><td align="center"><a class="btn btn--yellow print '+disable+'"  '+print+' name="print" id="'+data.id+'"><i class="glyphicon glyphicon-download-alt"></i></a></td></tr>');
    });
  $('#example').dataTable();
  }
});
