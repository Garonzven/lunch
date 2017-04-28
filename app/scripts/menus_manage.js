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
      var dish = {
        title: 'Dish',
        start: start.add(1, 'seconds'),
        type: 9,
        overlap: false,
        editable: false,
        backgroundColor: '#254154',
        borderColor: '#254154',
      }
      $('#calendar').fullCalendar('renderEvent', dish, true);
      theCycle.dishes.push(dish);
      console.log(theCycle.dishes);
    }
  },
  eventClick: function(event) {
    if (event.type == 9)
      alert(event.start.format('YYYY-MM-DD'));
  }
});
