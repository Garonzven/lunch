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

var mySelection = [];
$.ajax({
  url: constants().orderActive + '?token='+$.cookie('token'),
  type: 'GET',
  dataType: 'JSON',
  success: function(response) {
    console.log(response);
    // switch (response.code) {
    //   case '200':
    //     break;
    //
    //   case '404':
    //     swal(
    //       'Oups!',
    //       response.message,
    //       'error'
    //     );
    //     break;
    // }
    var date='';
    if (response.data) {
      console.log('ob');
      $('.fecha').text(moment(response.data[0].limit_date).format('YYYY-MM-DD hh:mm:ss a'));
      // Cycle
      $.each(response.data,function(key,val){
        console.log('flag',val);
        // Dishes
        $.each(val.dishes,function(k,data){
          if(!data.deleted_at){
            if(date != data.date_cycle){

              mySelection.push({
                date_order: data.date_cycle,
                id_dish: 1
              });

              day = formatDate(data.date_cycle);
              cid = formatId(data.date_cycle);
              $('.ciclo').append('<li id="'+cid+'" class="ciclo-day" onClick=" addActive(this)"><a>'+formatDate(data.date_cycle)+'</a></li>');
              $('.checkboxes').append('<div class="form-group menu_'+cid+'"><label><input type="checkbox" name="noThanks[]" class="no-thanks" data-date="' + data.date_cycle + '" onclick="addOrderCheckbox(\'' + data.date_cycle + '\', this)" checked="checked">  No, thanks.</label><br></div>');
            }
            $('.menus').append('<div id="'+data.id_dish+'_'+formatId(data.date_cycle)+'" class="menu menu_'+cid+' col-sm-6 col-md-4"><div class="thumbnail thumbnail-menu"><div class="caption"><p class="text-justify thumbnail-desc">'+data.title+' </p><p class="put-bottom"><button type="button" onClick="Select(this.id, \'' + data.date_cycle + '\', ' + data.id_dish + ')"  id="dish_'+data.id_dish+'"_"'+data.date_cyle+'" class="btn btn--menu btn--yellow pull-right" role="button">Select</button> </p><input type="hidden" id="date_order[]" value="'+data.date_cycle+'" disabled=""></input><input type="hidden" id="id_dish[]" value="'+data.id_dish+'" disabled=""></input><p class="title-menu">'+data.description+'</p></div></div></div>');
            date = data.date_cycle;
          }
        });
      });
    }
    $('.ciclo').children().first().addClass('current');
    id_active = $('.ciclo').children().first().attr('id');
    $('.menu_'+id_active).addClass('current');
  }
});


$('.navContainer__logo').addClass('navContainer__logo--center');
function Select(id, date, id_dish){
  $('#'+id).removeClass('btn--yellow').addClass('btn--red unselect').text('Unselect');
  $('#'+id).attr('onclick','Unselect(this.id)');
  var formid = $('#'+id).closest('div .menu').attr('id');
  $('.current button').each(function(){
      $(this).attr('disabled', true);
  });
  $('.checkboxes .current input').each(function(){
      $(this).attr('disabled', true);
  });

  $('#'+id).attr('disabled',false);
  $('#'+formid+' input').each(function(){
      $(this).attr('disabled', false);
  });
  $('.ciclo .current').addClass('selected');

  $.map(mySelection, function(o, i) {
    if (o.date_order == date) {
      o.id_dish = id_dish;
    }
  });
}

function Unselect(id){
  $('#'+id).addClass('btn--yellow').removeClass('btn--red unselect').text('Select');
  $('#'+id).attr('onclick','Select(this.id)');
  var formid = $('#'+id).closest('div .menu').attr('id');
  $('.current button').each(function(){
      $(this).attr('disabled', false);
  });

  $('.checkboxes .current input').each(function(){
      $(this).attr('disabled', false);
  });

  $('#'+formid+' input').each(function(){
      $(this).attr('disabled', true);
  });
  $('.ciclo >li.selected').removeClass('selected');
}

function addOrderCheckbox(date, e) {
  $.map(mySelection, function(o, i) {
    if (o.date_order == date) {
      if ($(this).attr('checked')) {
        o.id_dish = 1;
      }
    }
  });
}

function addOrder(date, id){
  console.log(mySelection);
  $.ajax({
    url: constants().orderRegister + '?token=' + $.cookie('token'),
    method: 'post',
    data: {
      dishes: mySelection
    },
    dataType: 'json',
    success: function(data) {
      console.log(data);
      swal({
        text: data.message,
        type: 'success',
        confirmButtonText: 'Ok'
      });
    },
    error: function(error) {
      console.log(error);
    }
  });
  // $.each(mySelection, function(i, o) {
  //   if (o.date_order == date) {
  //     o.id_dish = id;
  //   }
  // });
}
  $('div .menu input').each(function(){
    if(!$(this).prop('disabled')){
      console.log($(this).attr('id')+":"+$(this).attr('value'));
    }

  });
  // $.ajax({
  //   url: constants().orderRegister + '?token=' + $.cookie('token'),
  //   data:[
  //     {date:'2017-05-09',dish:'29'}
  //   ],
  //   dataType:'JSON',
  //   method:'POST',
  //   success: function(data){
  //     console.log(data)
  //   }
  // });

function formatDate(date) {
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var d = new Date(date);
  var n = monthNames[d.getMonth()]+', '+d.getDate();
  return n;
}

function formatId(date){
  var d = new Date(date);
  // var n = d.format('YYYY-MM-DD');
  var n = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();
  return n;
}

function addActive(li){
  id_active = $(li).attr('id');

  $('.ciclo >li.current').removeClass('current');
  $('.ciclo > li#'+id_active).addClass('current');
  $('.menus .current').removeClass('current');
  $('.menu_'+id_active).addClass('current');
  $('.checkboxes .current').removeClass('current');
  $('.menu_'+id_active).addClass('current');

}
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
