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
    switch (response.code) {
      case '200':
        var date='';
        $('.fecha').text(moment(response.data.limit_date).format('YYYY-MM-DD hh:mm:ss a'));
        // Dishes rendering
        $.each(response.data.dishes, function(k, data) {
          if(!data.deleted_at) {
            if(date != data.date_cycle) {

              mySelection.push({
                date_order: data.date_cycle,
                id_dish: 1
              });

              day = formatDate(data.date_cycle);
              cid = formatId(data.date_cycle);
              $('.ciclo').append('<li id="'+cid+'" class="ciclo-day" data-date="'+ data.date_cycle+'" onClick=" addActive(this)"><a>'+formatDate(data.date_cycle)+'</a></li>');
              $('.checkboxes').append('<div class="form-group menu_'+cid+'"><label><input id="'+moment(data.date_cycle).format('YYYY-MM-DD')+'" type="checkbox" data-date="' + data.date_cycle + '" data-id_dish="1" onclick="Select(this)" checked>  No, thanks.</label><br></div>');
            }
            $('.menus').append('<div id="'+data.id_dish+'_'+formatId(data.date_cycle)+'" class="menu menu_'+cid+' col-sm-6 col-md-4"><div class="thumbnail thumbnail-menu"><div class="caption"><p class="text-justify thumbnail-desc">'+data.title+' </p><p class="put-bottom"><button type="button" onClick="Select(this)" class="btn btn--menu btn--yellow pull-right" role="button" data-date="'+data.date_cycle+'" data-id_dish="'+data.id_dish+'">Select</button> </p><input type="hidden" id="date_order[]" value="'+data.date_cycle+'" disabled=""><input type="hidden" id="id_dish[]" value="'+data.id_dish+'" disabled=""><p class="title-menu">'+data.description+'</p></div></div></div>');
            date = data.date_cycle;
          }
        });
        $('.ciclo').children().first().addClass('current');
        id_active = $('.ciclo').children().first().attr('id');
        $('.menu_'+id_active).addClass('current');

        $.ajax({
          url: constants().orderListOrder + '?token=' + $.cookie('token'),
          method: 'get',
          dataType: 'json',
          success: function(response) {
            if (response.data) {
              $.map(mySelection, function(o, i) {
                o.date_order = response.data[i].date_cycle;
                o.id_dish = response.data[i].id_dish;
              });

              $.each(mySelection, function(i, o) {
                $('.current button, .menu button').each(function(_i, e) {
                  if ($(e).data('id_dish') == o.id_dish) {
                    $(e).trigger('click');
                  }
                });
              });
            }
          }
        });
        break;

      case '404':
        swal(
          'Oups!',
          response.message,
          'error'
        );
        break;
    }
  }
});


$('.navContainer__logo').addClass('navContainer__logo--center');

function Select(el) {
  if ($(el).data('id_dish') != 1) {
    console.log($(el).data('id_dish'));
    $('.current button').removeClass('btn--red unselect').addClass('btn--yellow').text('Select');
    $('.current button').attr('onclick', 'Select(this)');
    $(el).removeClass('btn--yellow').addClass('btn--red unselect').text('Unselect');
    $(el).attr('onclick', 'Unselect(this)');
    $('.ciclo .current').addClass('selected');
    $('#'+moment($(el).data('date')).format('YYYY-MM-DD')).removeAttr('checked');
    $.map(mySelection, function(o) {
      if (o.date_order == $(el).data('date')) {
        o.id_dish = $(el).data('id_dish');
      }
    });
  } else {
    $('.current button').removeClass('btn--red unselect').addClass('btn--yellow').text('Select');
    $('.current button').attr('onclick', 'Select(this)');
    $(el).removeClass('btn--yellow').addClass('btn--red unselect').text('Unselect');
    $('.ciclo .current').removeClass('selected');
    $.map(mySelection, function(o) {
      if (o.date_order == $(el).data('date')) {
        o.id_dish = $(el).data('id_dish');
      }
    });
  }
}

function Unselect(el) {
  if ($(el).data('id_dish') != 1) {
    $('.current button').removeClass('btn--red unselect').addClass('btn--yellow').text('Select');
    $('.current button').attr('onclick', 'Select(this)');
    $(el).removeClass('btn--red unselect').addClass('btn--yellow').text('Select');
    $('.ciclo .current').removeClass('selected');
    console.log('#'+moment($(el).data('date')).format('YYYY-MM-DD'));
    $('#'+moment($(el).data('date')).format('YYYY-MM-DD')).attr('checked', '');
  }
}

// function addOrderCheckbox(date, e) {
//   $.map(mySelection, function(o, i) {
//     if (o.date_order == date) {
//       if ($(this).attr('checked')) {
//         o.id_dish = 1;
//       }
//     }
//   });
// }

function addOrder(){
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
      console.log($(this).attr('id')+':'+$(this).attr('value'));
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
  // schedules:[
  //   {name:'PendingMenu',
  //    date: '2017-05-09'}
  // ]
});

$('.ciclo-day').on('click', function() {

})
