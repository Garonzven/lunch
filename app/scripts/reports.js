$.ajax({
  url: 'menu_admin.html',
  method: 'get',
  dataType: 'text',
  success: function(data) {
    $('.sidebar-nav').html(data);
  }
});

$(document).ready(function(){
  $('#example').dataTable();

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
