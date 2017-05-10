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
var mySelection2 = [];
$.ajax({
  url: constants().orderActive + '?token='+$.cookie('token'),
  type: 'GET',
  dataType: 'JSON',
  success: function(response) {
    switch (response.code) {
      case '200':
        var date='';
        $('.fecha').text(moment(response.data.limit_date).format('YYYY-MM-DD [before] hh:mm:ss a'));
        // Dishes rendering
        $.each(response.data.dishes, function(k, data) {
          if(!data.deleted_at) {
            if(date != data.date_cycle) {

              mySelection.push({
                date_order: data.date_cycle,
                id_dish: 1
              });

              day = formatDate(data.date_cycle);
              // cid = formatId(data.date_cycle);
              cid = 'tab_'+moment(data.date_cycle).format('YYYY-MM-DD');
              $('.ciclo').append('<li id="'+cid+'" class="ciclo-day" data-date="'+ data.date_cycle+'" onClick=" addActive(this)"><a>'+formatDate(data.date_cycle)+'</a></li>');
              $('.checkboxes').append('<div class="form-group menu_'+cid+'"><label><input id="'+moment(data.date_cycle).format('YYYY-MM-DD')+'" type="checkbox" data-date="' + data.date_cycle + '" data-id_dish="1" onchange="Select(this)" checked>  No, thanks.</label><br></div>');
            }
            $('.menus').append('<div id="'+data.id_dish+'_'+cid+'" class="menu menu_'+cid+' col-sm-6 col-md-4"><div class="thumbnail thumbnail-menu"><div class="caption"><p class="text-justify thumbnail-desc">'+data.title+' </p><p class="put-bottom"><button type="button" onClick="Select(this)" class="btn btn--menu btn--yellow pull-right" role="button" data-date="'+data.date_cycle+'" data-id_dish="'+data.id_dish+'">Select</button> </p><input type="hidden" id="date_order[]" value="'+data.date_cycle+'" disabled=""><input type="hidden" id="id_dish[]" value="'+data.id_dish+'" disabled=""><p class="title-menu">'+data.description+'</p></div></div></div>');
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
            console.log(response.data);
            if (response.data) {
              $.map(response.data, function(o, i) {
                mySelection2.push({
                  date_order: o.date_cycle,
                  id_dish: function() {
                    return o.id_dish == undefined ? 1 : o.id_dish;
                  }()
                });
              });

              mySelection = [];
              $.each(mySelection2, function(i, o) {
                mySelection.push({
                  date_order: o.date_order,
                  id_dish: o.id_dish
                });
                $('.menu button').each(function(_i, e) {
                  if ($(e).data('id_dish') == o.id_dish) {
                    $(e).removeClass('btn--yellow').addClass('btn--red unselect').text('Unselect');
                    $(e).attr('onclick', 'Unselect(this)');
                    $('#'+moment($(e).data('date')).format('YYYY-MM-DD')).removeAttr('checked');
                    $('#'+moment($(e).data('date')).format('YYYY-MM-DD')).attr('onchange', 'Select(this)');
                  }
                });
                $('.checkboxes input').each(function(_i, e) {
                  if (1 == o.id_dish && $(e).data('date') == o.date_order) {
                    $(e).attr('onchange', 'Unselect(this)');
                  }
                });
                if (o.id_dish > 1) {
                  $('#tab_'+moment(o.date_order).format('YYYY-MM-DD')).addClass('selected');
                }
              });
            }
          }
        });
        break;

      case '404':
      swal({
      text: response.message,
      imageUrl:'assets/error.png',
      confirmButtonText: 'Ok'
    });
        break;
    }
  }
});

$('.navContainer__logo').addClass('navContainer__logo--center');

function Select(el) {
  $('.current button').removeClass('btn--red unselect').addClass('btn--yellow').text('Select');
  $('.current button').attr('onclick', 'Select(this)');
  $(el).removeClass('btn--yellow').addClass('btn--red unselect').text('Unselect');
  if (el.type == 'checkbox') {
    $(el).attr('onchange', 'Unselect(this)');
  } else {
    $(el).attr('onclick', 'Unselect(this)');
  }
  $.map(mySelection, function(o) {
    if (o.date_order == $(el).data('date')) {
      o.id_dish = $(el).data('id_dish');
    }
  });
  if ($(el).data('id_dish') != 1) {
    $('.ciclo .current').addClass('selected');
    $('#'+moment($(el).data('date')).format('YYYY-MM-DD')).prop('checked', false);
  } else {
    $('.ciclo .current').removeClass('selected');
  }
}

function Unselect(el) {
  if ($(el).data('id_dish') != 1) {
    $('.current button').removeClass('btn--red unselect').addClass('btn--yellow').text('Select');
    $(el).removeClass('btn--red unselect').addClass('btn--yellow').text('Select');
    $('.ciclo .current').removeClass('selected');
    $('#'+moment($(el).data('date')).format('YYYY-MM-DD')).prop('checked', true);
    $(el).attr('onclick', 'Select(this)');
    $.map(mySelection, function(o) {
      if (o.date_order == $(el).data('date')) {
        o.id_dish = 1;
      }
    });
  } else {
    $(el).attr('onchange', 'Select(this)');
    $.map(mySelection, function(o) {
      if (o.date_order == $(el).data('date')) {
        o.id_dish = 0;
      }
    });
  }
}

function addOrder() {
  var warn = false;
  $.map(mySelection, function(o) {
    switch (o.id_dish) {
      case 0:
        o.id_dish = 1;

      case 1:
        warn = true;
    }
  });
  if (warn) {
    swal({
      title: 'Oups!',
      html: 'You have days without selection.<br>Are you sure you want to continue?',
      imageUrl:'assets/warning_1.png',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(function() {
      saveOrder();
    });
  } else {
    saveOrder();
  }
}

function saveOrder() {
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
      }).then(function() {
        location.reload();
      });
    },
    error: function(error) {
      console.log(error);
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
