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
var dishDay;

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
      dishDay = start;
      $('.dish-list').empty();
      $('#dish-add').show();
      $('#dish-update').hide();
      $('#dish-cancel-update').hide();
      $('#dish-title').val('');
      $('#dish-description').val('');
      var dayDishes = [];
      dayDishes = $.grep(currentCycle.dishes, function(o) {
        return o.start.format('YYYY-MM-DD') == start.format('YYYY-MM-DD');
      });
      $.each(dayDishes, function(i, o) {
        $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + o.title + '" data-description="' + o.description + '" data-id="' + o.id + '">' + o.title + '</a><a href="#" class="dish-delete"><span class="glyphicon glyphicon-trash"></span></a></li>');
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
          backgroundColor: '#ff9800',
          borderColor: '#ff9800',
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
            $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + dish.title + '" data-description="' + dish.description + '" data-id="' + dish.id + '">' + dish.title + '</a><a href="#" class="dish-delete"><span class="glyphicon glyphicon-trash"></span></a></li>');
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
var dayDishes = [];
$('body').on('click', 'a.dish-title', function() {
  dishUpdateId = $(this).data('id');
  $('#dish-update').show();
  $('#dish-cancel-update').show();
  $('#dish-add').hide();
  $('#dish-title').val($(this).data('title')).focus();
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

      $('.dish-list').empty();

      $.map(currentCycle.dishes, function(o, i) {
        if (o.id == dishUpdateId) {
          o.title = $('#dish-title').val();
          o.description = $('#dish-description').val();
        }
      });

      dayDishes = $.grep(currentCycle.dishes, function(o) {
        return o.start.format('YYYY-MM-DD') == dishDay.format('YYYY-MM-DD');
      });
      $.each(dayDishes, function(i, o) {
        $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + o.title + '" data-description="' + o.description + '" data-id="' + o.id + '">' + o.title + '</a><a href="#" class="dish-delete"><span class="glyphicon glyphicon-trash"></span></a></li>');
      });

      $('#dish-update').hide();
      $('#dish-cancel-update').hide();
      $('#dish-add').show();
      $('#dish-title').val('').focus();
      $('#dish-description').val('');
    }
  });
});
$('#dish-cancel-update').on('click', function() {
    $('#dish-title').val('').focus();
    $('#dish-description').val('');
    $('#dish-update').hide();
    $('#dish-add').show();
    $(this).hide();
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
$('#dish-ok').on('click', function() {
  var del = $('#calendar').fullCalendar('clientEvents', function(e) {
    return e.type == 9 && e.start.format('YYYY-MM-DD') == dishDay.format('YYYY-MM-DD');
  });
  var x=[];
  $.map(del, function(o, i) {
    x.push({id:o._id});
  });
  $.each(x, function(i, o) {
    $('#calendar').fullCalendar('removeEvents', o.id);
  });
  var a = $.grep(currentCycle.dishes, function(o, i) {
    return o.type == 9 && o.start.format('YYYY-MM-DD') == dishDay.format('YYYY-MM-DD');
  });
  $('#calendar').fullCalendar('renderEvents', a, true);
});
$('body').on('click', 'a.dish-delete', function() {
  swal({
    html: '<span class="delete-dish">You are about to remove a dish from the menu<br><br>Are you sure?</span>',
    imageUrl:"assets/warning_1.png",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then(function () {
    console.log('true');
  }, function() {});
});

// Defaults
$('.navContainer__logo').addClass('navContainer__logo--center');
$('#dish-update').hide();
$('#dish-cancel-update').hide();
