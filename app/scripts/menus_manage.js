// Load profile
$.ajax({
  url: constants().server + constants().profile + '?token=' + $.cookie('token'),
  method: 'get',
  dataType: 'json',
  success: function(data) {
    switch (data.code) {
      case '200':
        $('#fullname').text(data.user.name);
        $('.sidebar-nav').load('menu_admin.html');
        break;
    }
  },
  error: function(error) {
    console.log(error);
    switch (error.status) {
      case 401:
        $(location).attr('href', 'login.html');
        break;
    }
  }
});

// Cycles
var theCycle = {};
$.ajax({
  url: constants().server + constants().cycleFind + '?token=' + $.cookie('token'),
  method: 'get',
  dataType: 'json',
  success: function(data) {
    console.log(data);
    switch (data.code) {
      case '200':
        if (data.data.length > 0) {
          $.each(data.data, function(i, o) {
            if (o.active == 1) {
              theCycle = {
                type: 1,
                start: moment(o.initial_date).format('YYYY-MM-DD'),
                end: moment
              }
            }
          });
          $('#calendar').fullCalendar({
            eventLimit: true,
            editable: true,
            selectable: true,
            header: {
              left: '',
              center: 'title'
            },
            events: [],
            select: function(start, end) {

            }
          });
        }
        break;

      case '404':
        break;
    }
  }
});

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
        var dish = {
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
          url: constants().server + constants().dishRegister + '?token=' + $.cookie('token'),
          method: 'post',
          data: {
            title: $('#dish-title').val(),
            description: $('#dish-description').val(),
            id_provider: 1
          },
          success: function(data) {
            dish.id = data.data.id;
            $('.dish-list').append('<li>' + dish.title + '</li>');
            $('#calendar').fullCalendar('renderEvent', dish, true);
            theCycle.dishes.push(dish);
            $('#dish-title').val('').focus();
            $('#dish-description').val('');
          }
        });
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

  $.ajax({
    url: constants().server + constants().cycleRegister + '?token=' + $.cookie('token'),
    method: 'post',
    data: cycle,
    dataType: 'json',
    success: function(data) {
      console.log(data);
    }
  });
});
