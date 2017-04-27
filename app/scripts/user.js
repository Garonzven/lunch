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
      { title: 'Name', data:'name'},
      { title: 'Creation date', data:'created_at'},
      { title: 'Profile', data: switch (id_profile){
        case 1: 'user';
        case 2: 'admin';
        case 3: 'watcher'
      }
      },


    ]
  });
});
