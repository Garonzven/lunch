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
      var dayDishes = [];
      dayDishes = $.grep(currentCycle.dishes, function(o) {
        return o.start.format('YYYY-MM-DD') == start.format('YYYY-MM-DD');
      });
      $.each(dayDishes, function(i, o) {
        $('.dish-list').append('<li>' + o.title + '</li>');
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
            $('.dish-list').append('<li>' + dish.title + '</li>');
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
    console.log(data);
    switch (data.code) {
      case '200':
        if (data.data.length > 0) {
          var events=[], start, end;
          $.each(data.data, function(i, o) {
            console.log(o);
            start = moment(o.initial_date);
            end = moment(o.closing_date).add(1, 'days').subtract(1, 'seconds');
            title = 'Cycle from ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD');
            switch (o.active) {
              case 0:
                events.push({
                  id: o.id_dish,
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
                  dishes: function() {
                    var dishArr = [];
                    $.each(o.dishes, function(_i, _o) {
                      var dish = {
                        id: _o.id,
                        title: _o.title,
                        description: _o.description,
                        start: moment(_o.date_cycle).add(1, 'seconds'),
                        type: 9,
                        overlap: false,
                        editable: false,
                        backgroundColor: '#254154',
                        borderColor: '#254154',
                      };
                      dishArr.push(dish);
                      events.push(dish);
                    });
                    return dishArr;
                  }()
                }
                events.push(currentCycle);
                $('#calendar').fullCalendar('renderEvents', events, true);
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

// function hasCycle() {
//   var cycle = [];
//   cycle = $('#calendar').fullCalendar('clientEvents', function(e) {
//     return e.type == 0;
//   });
//   if (cycle.length == 1 && !theCycle.title) {
//     theCycle = cycle[0];
//     theCycle.dishes = [];
//   }
//   return cycle.length > 0;
// }

// function canCreate(start) {
//   if (hasCycle()) {
//     if (moment(start.format('YYYY-MM-DD')).isBetween(theCycle.start.format('YYYY-MM-DD'), theCycle.end.format('YYYY-MM-DD'), null, '[]')) {
//       return true;
//     } else {
//       return false;
//     }
//   } else {
//     return false;
//   }
// }

$('.navContainer__logo').addClass('navContainer__logo--center');

// $('#calendar').fullCalendar({
//   eventLimit: true,
//   editable: true,
//   selectable: true,
//   header: {
//     left: '',
//     center: 'title'
//   },
//   select: function(start, end) {
//     if (!hasCycle() && today.diff(start) < 0) {
//       var cycle = {
//         title: 'Cycle from ' + start.format('YYYY-MM-DD') + ' to ' + end.subtract(1, 'seconds').format('YYYY-MM-DD'),
//         start: start,
//         end: end,
//         type: 0,
//         overlap: false,
//         editable: false,
//       }
//       console.log(cycle);
//       $('#calendar').fullCalendar('renderEvent', cycle, true);
//     }
//   },
//   dayClick: function(start) {
//     if (canCreate(start)) {
//       $('.dish-list').empty();
//       var dayDishes = [];
//       dayDishes = $.grep(theCycle.dishes, function(e) {
//         return e.start.format('YYYY-MM-DD') == start.format('YYYY-MM-DD');
//       });
//       $.each(dayDishes, function(i, e) {
//         $('.dish-list').append('<li>' + e.title + '</li>');
//       });
//       $('#modalDish').modal('show');
//       $('#dish-add').off().on('click', function() {
//         var dish = {
//           title: $('#dish-title').val(),
//           description: $('#dish-description').val(),
//           start: start.add(1, 'seconds'),
//           type: 9,
//           overlap: false,
//           editable: false,
//           backgroundColor: '#254154',
//           borderColor: '#254154',
//         }

//         $.ajax({
//           url: constants().dishRegister + '?token=' + $.cookie('token'),
//           method: 'post',
//           data: {
//             title: $('#dish-title').val(),
//             description: $('#dish-description').val(),
//             id_provider: 1
//           },
//           success: function(data) {
//             dish.id = data.data.id;
//             $('.dish-list').append('<li>' + dish.title + '</li>');
//             $('#calendar').fullCalendar('renderEvent', dish, true);
//             theCycle.dishes.push(dish);
//             $('#dish-title').val('').focus();
//             $('#dish-description').val('');
//           }
//         });
//       });
//     }
//   },
//   eventClick: function(event) {
//     if (event.type == 9)
//       alert(event.start.format('YYYY-MM-DD'));
//   }
// });

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
  console.log(cycle);

  // $.ajax({
  //   url: constants().cycleRegister + '?token=' + $.cookie('token'),
  //   method: 'post',
  //   data: cycle,
  //   dataType: 'json',
  //   success: function(data) {
  //     console.log(data);
  //   }
  // });
});
