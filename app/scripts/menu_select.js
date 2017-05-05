
$('.navContainer__logo').addClass('navContainer__logo--center');

// Load profile
// $.ajax({
//   url: constants().profile + '?token=' + $.cookie('token'),
//   method: 'get',
//   data: {
//     token: $.cookie('token')
//   },
//   dataType: 'json',
//   success: function(data) {
//     switch (data.code) {
//       case '200':
//         console.log(data.user);
//         $('#fullname').text(data.user.name);
//         $('.full-name').text(data.user.name);
//
//         $.ajax({
//           url: 'menu_admin.html',
//           method: 'get',
//           dataType: 'text',
//           success: function(data) {
//         $('.sidebar-nav').load('menu_admin.html');
//           }
//         });
//         break;
//
//       case 400:
//         $(location).attr('href', 'login.html');
//         break;
//     }
//   }
// });

function Select(id){
  $('#'+id).removeClass('btn--yellow').addClass('btn--green').text('Selected');
}

function formatDate(date) {
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var d = new Date(date);
  var n = monthNames[d.getMonth()]+', '+d.getDate();
  return n;
}

function formatId(date){
  var d = moment(date);
  var n = d.format('YYYY-MM-DD');
  // var n = d.getFullYear()+'-'+d.getElementsByClassName('className')Month()+'-'+d.getDay();
  return n;
}

function addActive(li){
  id_active = $(li).attr('id');

  $('.ciclo >li.current').removeClass('current');
  $('.ciclo > li#'+id_active).addClass('current');
  $('.menus .current').removeClass('current');
  $('.menu_'+id_active).addClass('current');

}

$('document').ready(function(){
  $.ajax({
    url: constants().cycleFind + '?token='+$.cookie('token'),
    // url: 'cycleactive.json',
    type:'get',
    dataType:'JSON',
    success: function(data){
    console.log(data);
    date="";
      $.each(data,function(key,val){
        $.each(val.dishes,function(k,data){
          if(!data.deleted_at){
            if(date != data.date_cycle){
              day = formatDate(data.date_cycle);
              cid = formatId(data.date_cycle);
              $('.ciclo').append('<li id="'+cid+'" class="ciclo-day" onClick=" addActive(this)"><a>'+formatDate(data.date_cycle)+'</a></li>');
              $('.checkboxes').append('<div class="form-group"><label></label><input type="checkbox" value="dont"/> </div>');
            }
             $('.menus').append('<div class="menu_'+cid+' col-sm-6 col-md-4"><div class="thumbnail thumbnail-menu"><div class="caption"><input type="hidden" id="dish" value="'+data.id_dish+'"></input><p class="title-menu">'+data.title+'</p><p class="text-justify thumbnail-desc">'+data.description+' </p><p class="put-bottom"><a href="#" onClick="Select(this.id)"  id="'+data.id_dish+'" class="btn btn--menu btn--yellow pull-right" role="button">Select</a> </p></div></div></div>');
            date = data.date_cycle;
          }
      });
    });
    $('.ciclo').children().first().addClass('current');
    id_active = $('.ciclo').children().first().attr('id');
    console.log(id_active);
    $('.menu_'+id_active).addClass('current');
    }
  });
});



$('.mini_calendar').pignoseCalendar({
  initialized:'false',
  scheduleOptions:{
    colors: {
      today: '#ff0080',
      SelectedMenu: '#75bd7e',
      CurrentMenu: '#ff9800',
      PendingMenu:  '#ffcdd2'
    }
  },
  schedules:[
    {name:'PendingMenu',
     date: '2017-05-09'}
  ]
});
