$.ajax({
  url: constants().orderActive + '?token=' + $.cookie('token'),
  method: 'get',
  dataType: 'json',
  success: function(data) {
    if (moment(data.data.date_limit).diff(moment()) < 0) {
      $('.ciclo, .checkboxes, .menu').hide();
      swal({
        title: 'Sorry',
        text: 'The time for choosing expired.',
        imageUrl:'assets/error.png',
        confirmButtonText: 'Ok'
    });
    }
  })
});
