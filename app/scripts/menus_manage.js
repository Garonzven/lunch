$.ajax({
  url: 'login.json',
  method: 'get',
  data: {
    token: $.cookie('token')
  },
  dataType: 'json',
  success: function(data) {
    switch (data.code) {
      case 200:
        $('#fullname').text(data.user.name);
        $.ajax({
          url: 'menu_admin.html',
          method: 'get',
          dataType: 'text',
          success: function(data) {
            $('.sidebar-nav').html(data);
          }
        });
        break;

      case 400:
        $(location).attr('href', 'login.html');
        break;
    }
  }
});

var theCycle = {};
var today = moment();

function hasCycle() {
  var cycle = [];
  cycle = $('#calendar').fullCalendar('clientEvents', function(e) {
    return e.type == 0;
  });
  if (cycle.length == 1 && !theCycle.title) {
    theCycle = cycle[0];
    theCycle.dishes = [];
  }
  return cycle.length > 0;
}

function canCreate(start) {
  if (hasCycle()) {
    if (start.isBetween(theCycle.start, theCycle.end) ||
      start.isSame(theCycle.start) ||
      start.isSame(theCycle.end)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

$('.navContainer__logo').addClass('navContainer__logo--center');

$('#calendar').fullCalendar({
  eventLimit: true,
  editable: true,
  selectable: true,
  header: {
    left: '',
    center: 'title'
  },
  events: [
    {
      start: '2017-04-18',
      end: moment('2017-04-21').add(1, 'days'),
      allDay: true,
      title: 'asdasdas',
      editable: false,
      type: 1,
      backgroundColor: '#ff0000',
      borderColor: '#ff0000'
    }
  ],
  select: function(start, end) {
    if (!hasCycle() && today.diff(start) < 0) {
      var cycle = {
        title: 'Cycle',
        start: start,
        end: end.subtract(1, 'seconds'),
        type: 0,
        overlap: false,
        editable: false,
      }
      $('#calendar').fullCalendar('renderEvent', cycle, true);
    }
  },
  dayClick: function(start) {
    if (canCreate(start)) {
      $('.dish-list').empty();
      var dayDishes = [];
      dayDishes = $.grep(theCycle.dishes, function(e) {
        return e.start.format('YYYY-MM-DD') == start.format('YYYY-MM-DD');
      });
      $.each(dayDishes, function(i, e) {
        $('.dish-list').append('<li>' + e.title + '</li>');
      });
      $('#modalDish').modal('show');
      $('#dish-add').off().on('click', function() {
        var dish = {};
        dish = {
          id: Math.random().toString().substr(4,5),
          title: $('#dish-title').val(),
          description: $('#dish-description').val(),
          start: start.add(1, 'seconds'),
          type: 9,
          overlap: false,
          editable: false,
          backgroundColor: '#254154',
          borderColor: '#254154',
        }

        $.ajax({
          url: 'http://13.92.198.201/laravel/public/dish/register?token=' + $.cookie('token'),
          method: 'post',
          data: {
            title: $('#dish-title').val(),
            description: $('#dish-description').val(),
            id_provider: 1
          },
          success: function(data) {
            console.log(data);
          }
        });

        $('.dish-list').append('<li>' + dish.title + '</li>');
        $('#calendar').fullCalendar('renderEvent', dish, true);
        theCycle.dishes.push(dish);
        $('#dish-title').val('').focus();
        $('#dish-description').val('');
      });
    }
  },
  eventClick: function(event) {
    if (event.type == 9)
      alert(event.start.format('YYYY-MM-DD'));
  }
});

$('#modalDish').on('shown.bs.modal', function(e) {
  $('#dish-title').focus();
});


var theDishes;
function dateExists(obj) {
  var res=false;

  $.each(theDishes, function(i, o) {
    if (o.date_cycle == obj.start.format('YYYY-MM-DD')) {
      res = true;
      return false;
    }
  });
  return res;
}

$('#save-cycle').on('click', function() {
  var cycle = {};

  theDishes = [];
  $.each(theCycle.dishes, function(i, o) {
    if (!dateExists(o)) {
      theDishes.push({
        date_cycle: o.start.format('YYYY-MM-DD'),
        id_dishes: []
      });
    }
  });

  $.each(theDishes, function(i, o) {
    $.each(theCycle.dishes, function(_i, _o) {
      if (o.date_cycle == _o.start.format('YYYY-MM-DD')) {
        o.id_dishes.push(_o.id);
      }
    });
  });

  cycle = {
    init: theCycle.start.format('YYYY-MM-DD'),
    close: theCycle.end.format('YYYY-MM-DD'),
    limit: moment.utc($('#limit-time').val()).format('YYYY-MM-DD hh:mm:ss'),
    data: theDishes,
  }
  console.log(cycle);
});
