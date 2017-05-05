
$('.navContainer__logo').addClass('navContainer__logo--center');

$.ajax({
  url: constants().profile + '?token=' + $.cookie('token'),
  method: 'get',
  data: {
    token: $.cookie('token')
  },
  dataType: 'json',
  success: function(data) {
    switch (data.code) {
      case '200':
        console.log(data.user);
        $('#fullname').text(data.user.name);
        $('.full-name').text(data.user.name);

        $.ajax({
          url: 'menu_admin.html',
          method: 'get',
          dataType: 'text',
          success: function(data) {
        $('.sidebar-nav').load('menu_admin.html');
          }
        });
        break;

      case 400:
        $(location).attr('href', 'login.html');
        break;
    }
  }
});

function Select(id){
  $('#'+id).removeClass('btn--yellow').addClass('btn--red unselect').text('Unselect');
  var formid = $('#'+id).closest('div .menu').attr('id');
  $('.current button').each(function(){
      console.log($(this).attr('id'));
      $(this).attr('disabled', true);
  });
  $('#'+id).attr('disabled',false);
  $('#'+formid+' input').each(function(){
      // console.log($(this).attr('value')+":"+$(this).attr('id'));
      $(this).attr('disabled', false);
  });

}

function addOrder(){
  $('div .menu input').each(function(){
    if(!$(this).prop('disabled')){
      console.log($(this).attr('id')+":"+$(this).attr('value'));
    }

  });
  $.ajax({
    url: constants().orderRegister + '?token=' + $.cookie('token'),
    data:[
      {date:'2017-05-09',dish:'29'}
    ],
    dataType:'JSON',
    method:'PUT',
    success: function(data){
      console.log(data)
    }
  });
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
  $('.checkboxes .current').removeClass('current');
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
      $.each(data.data,function(key,val){
        $.each(val.dishes,function(k,data){
          if(!data.deleted_at){
            if(date != data.date_cycle){
              day = formatDate(data.date_cycle);
              cid = formatId(data.date_cycle);
              $('.ciclo').append('<li id="'+cid+'" class="ciclo-day" onClick=" addActive(this)"><a>'+formatDate(data.date_cycle)+'</a></li>');
              $('.checkboxes').append('<div class="form-group menu_'+cid+'"><label><input type="checkbox" id="cbox1" value="first_checkbox">  No, thanks.</label><br></div>');
            }
             $('.menus').append('<div id="'+data.id_dish+'_'+formatId(data.date_cyle)+'" class="menu menu_'+cid+' col-sm-6 col-md-4"><div class="thumbnail thumbnail-menu"><div class="caption"><p class="text-justify thumbnail-desc">'+data.description+' </p><p class="put-bottom"><button type="button" onClick="Select(this.id)"  id="dish_'+data.id_dish+'"_"'+data.date_cyle+'" class="btn btn--menu btn--yellow pull-right" role="button">Select</button> </p><input type="hidden" id="date[]" value="'+formatId(data.date_cyle)+'" disabled=""></input><input type="hidden" id="dish[]" value="'+data.id_dish+'" disabled=""></input><p class="title-menu">'+data.title+'</p></div></div></div>');
            date = data.date_cycle;
          }
      });
    });
    $('.bottom-menu').append('<button type="button" onClick="addOrder()" class="btn btn--green pull-right" role="button">Save menu</button>');
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
