// Load profile
$.ajax({
  url: constants().profile + '?token=' + $.cookie('token'),
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
    switch (error.status) {
      case 400:
        $(location).attr('href', 'login.html');
        break;
    }
  }
});

// Cycles
var currentCycle = {};
var today = moment();
var theDishes;

// Calendar
$('#calendar').fullCalendar({
  displayEventTime: false,
  eventLimit: true,
  editable: true,
  selectable: true,
  header: {
    left: '',
    center: 'title'
  },
  select: function(start, end) {
    if (!hasCycle() && today.diff(start) < 0) {
      $('#calendar').fullCalendar('renderEvent', {
        title: 'Cycle from ' + start.format('YYYY-MM-DD') + ' to ' + end.subtract(1, 'seconds').format('YYYY-MM-DD'),
        start: start,
        end: end,
        type: 1,
        overlap: false,
        editable: false,
      }, true);
    }
  },
  dayClick: function(start) {
    if (canCreate(start)) {
      $('.dish-list').empty();
      $('#dish-add').show();
      $('#dish-update').hide();
      $('#dish-title').val('');
      $('#dish-description').val('');
      var dayDishes = [];
      dayDishes = $.grep(currentCycle.dishes, function(o) {
        return o.start.format('YYYY-MM-DD') == start.format('YYYY-MM-DD');
      });
      $.each(dayDishes, function(i, o) {
        $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + o.title + '" data-description="' + o.description + '" data-id="' + o.id + '">' + o.title + '</a></li>');
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
          url: constants().dishRegister + '?token=' + $.cookie('token'),
          method: 'post',
          data: {
            title: dish.title,
            description: dish.description,
            id_provider: 1
          },
          success: function(data) {
            dish.id = data.data.id;
            $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + dish.title + '" data-description="' + dish.description + '" data-id="' + dish.id + '">' + dish.title + '</a></li>');
            $('#calendar').fullCalendar('renderEvent', dish, true);
            currentCycle.dishes.push(dish);
            $('#dish-title').val('').focus();
            $('#dish-description').val('');
          },
          error: function(error) {
            console.log(error);
          }
        });
      });
    }
  },
  eventClick: function() {

  }
});

// Functions
function hasCycle() {
  var exists = [];
  exists = $('#calendar').fullCalendar('clientEvents', function(e) {
    return e.type == 1;
  });
  if (exists.length == 1 && !currentCycle.title) {
    currentCycle = exists[0];
    currentCycle.dishes = [];
  }
  return exists.length > 0;
}

function canCreate(start) {
  return hasCycle() && moment(start.format('YYYY-MM-DD')).isBetween(currentCycle.start.format('YYYY-MM-DD'), currentCycle.end.format('YYYY-MM-DD'), null, '[]');
}

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

// Load cycles from server
$.ajax({
  url: constants().cycleFind + '?token=' + $.cookie('token'),
  method: 'get',
  dataType: 'json',
  success: function(data) {
    switch (data.code) {
      case '200':
        if (data.data.length > 0) {
          var events=[], start, end;
          $.each(data.data, function(i, o) {
            start = moment(o.initial_date);
            end = moment(o.closing_date).add(1, 'days').subtract(1, 'seconds');
            title = 'Cycle from ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD');
            switch (o.active) {
              case 0:
                events.push({
                  title: title,
                  start: start,
                  end: end,
                  type: 4,
                  overlap: false,
                  editable: false
                });
                break;

              case 1:
                currentCycle = {
                  title: title,
                  start: start,
                  end: end,
                  type: 1,
                  overlap: false,
                  editable: false,
                  backgroundColor: '#d32f2f',
                  borderColor: '#d32f2f',
                  dishes: function() {
                    var dishArr = [];
                    $.each(o.dishes, function(_i, _o) {
                      if (!_o.deleted_at) {
                        var dish = {
                          id: _o.id_dish,
                          title: _o.title,
                          description: _o.description,
                          start: moment(_o.date_cycle).add(1, 'seconds'),
                          type: 9,
                          overlap: false,
                          editable: false,
                          backgroundColor: '#ff9800',
                          borderColor: '#ff9800',
                        };
                        dishArr.push(dish);
                        events.push(dish);
                      }
                    });
                    return dishArr;
                  }()
                }
                events.push(currentCycle);
                $('#calendar').fullCalendar('renderEvents', events, true);
                $('#limit-time').val(moment(o.limit_date).format('YYYY-MM-DDThh:mm'));
                break;

              case 2:
                break;
            }
          });
        }
        break;

      case '404':
        break;
    }
  }
});

// Events
var dishUpdateId;
$('body').on('click', 'a.dish-title', function() {
  dishUpdateId = $(this).data('id');
  $('#dish-update').show();
  $('#dish-add').hide();
  $('#dish-title').val($(this).data('title'));
  $('#dish-description').val($(this).data('description'));
});
$('#dish-update').on('click', function() {
  $.ajax({
    url: constants().dishUpdate + '/' + dishUpdateId + '?token=' + $.cookie('token'),
    method: 'put',
    data: {
      id: dishUpdateId,
      title: $('#dish-title').val(),
      description: $('#dish-description').val()
    },
    success: function(data) {
      $('#dish-update').hide();
      $('#dish-add').show();
      $('#dish-title').val('').focus();
      $('#dish-description').val('');
    }
  });
});
$('#modalDish').on('shown.bs.modal', function(e) {
  $('#dish-title').focus();
});
$('#save-cycle').on('click', function() {
  var cycle = {};

  theDishes = [];
  $.each(currentCycle.dishes, function(i, o) {
    if (!dateExists(o)) {
      theDishes.push({
        date_cycle: o.start.format('YYYY-MM-DD'),
        id_dishes: []
      });
    }
  });

  $.each(theDishes, function(i, o) {
    $.each(currentCycle.dishes, function(_i, _o) {
      if (o.date_cycle == _o.start.format('YYYY-MM-DD')) {
        o.id_dishes.push(_o.id);
      }
    });
  });

  cycle = {
    init: currentCycle.start.format('YYYY-MM-DD'),
    close: currentCycle.end.format('YYYY-MM-DD'),
    limit: moment.utc($('#limit-time').val()).format('YYYY-MM-DD hh:mm:ss'),
    data: theDishes,
  }

  $.ajax({
    url: constants().cycleRegister + '?token=' + $.cookie('token'),
    method: 'post',
    data: cycle,
    dataType: 'json',
    success: function(data) {
      console.log(data);
    }
  });
});

// Defaults
$('.navContainer__logo').addClass('navContainer__logo--center');
$('#dish-update').hide();
