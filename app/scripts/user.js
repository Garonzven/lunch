$('document').ready(function(){
  var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
  var d = new Date();
  var n = monthNames[d.getMonth()]+", "+d.getDate()+" "+d.getFullYear();
  $('.fecha').html(n);

  $('#example').DataTable({
    ajax: {
      url: 'user.json',
      dataSrc: 'data'
    },
    columns: [
      { data: 'name' },
      { data: 'created_at' },
      { data: 'id_profile' }
    ]
  });
});
