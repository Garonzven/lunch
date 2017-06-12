// Load profile
$.ajax({
  url: constants().profile + '?token=' + $.cookie('token'),
  method: 'get',
  dataType: 'json',
  success: function(data) {
    switch (data.code) {
      case '200':
      $('.fullname').text(data.user.name);
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

var today,
  allCycles = [],
  cycleColor = '#d32f2f',
  dishColor = '#ff9800',
  closedCycle = '',
  cycleId = 0;

// Get server date
$.ajax({
  url: constants().dateServer,
  method: 'get',
  dataType: 'json',
  async: false,
  success: function(data) {
    today = data.date;
  }
});

// Load cycles from server
$.ajax({
  url: constants().cycleFind + '?token=' + $.cookie('token'),
  method: 'get',
  dataType: 'json',
  success: function(data) {
    switch (data.code) {
      case '200':
        var start,
          end,
          title;

        allCycles = $.extend(true, [], data.data);
        $.map(allCycles, function(o) {
          start = moment(o.initial_date);
          end = moment(o.closing_date).add(1, 'days').subtract(1, 'seconds');
          title = 'Cycle from ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD');
          switch (o.active) {
            case 0:
            case 1:
            case 2:
              o.title = title;
              o.start = start;
              o.end = end;
              o.type = o.active;
              o.overlap = false;
              o.editable = false;
              break;
          }
        });
        $('#calendar').fullCalendar('renderEvents', allCycles, true);

    //     if (data.data.length > 0) {
    //       var events=[], start, end;
    //       $.each(data.data, function(i, o) {
    //         start = moment(o.initial_date);
    //         end = moment(o.closing_date).add(1, 'days').subtract(1, 'seconds');
    //         title = 'Cycle from ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD');
    //         switch (o.active) {
    //           case 0:
    //             events.push({
    //               title: title,
    //               start: start,
    //               end: end,
    //               type: 4,
    //               overlap: false,
    //               editable: false
    //             });
    //             break;
    //
    //           case 1:
    //             currentCycle = {
    //               id: o.id,
    //               title: title,
    //               start: start,
    //               end: end,
    //               type: 1,
    //               overlap: false,
    //               editable: false,
    //               backgroundColor: '#d32f2f',
    //               borderColor: '#d32f2f',
    //               dishes: function() {
    //                 var dishArr = [];
    //                 $.each(o.dishes, function(_i, _o) {
    //                   if (!_o.deleted_at) {
    //                     var dish = {
    //                       id: _o.id_dish,
    //                       title: _o.title,
    //                       description: _o.description,
    //                       start: moment(_o.date_cycle).add(1, 'seconds'),
    //                       type: 9,
    //                       overlap: false,
    //                       editable: false,
    //                       backgroundColor: '#ff9800',
    //                       borderColor: '#ff9800',
    //                     };
    //                     dishArr.push(dish);
    //                     events.push(dish);
    //                   }
    //                 });
    //                 return dishArr;
    //               }()
    //             }
    //             events.push(currentCycle);
    //             $('#calendar').fullCalendar('renderEvents', events, true);
    //             $('#limit-time').val(moment(o.limit_date).format('YYYY-MM-DDThh:mm'));
    //             break;
    //
    //           case 2:
    //             break;
    //         }
    //       });
    //     }
        break;

      case '404':
        swal({
          title: 'Oops!',
          text: data.message,
          imageUrl: 'assets/warning_1.png',
          confirmButtonText: 'Ok'
        });
        break;
    }
  }
});

// Cycles
var currentCycle = {};
var theDishes;
var dishDay;
var dishForm = $('#dish-form');

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
    end = end.subtract(1, 'seconds');
    if (start.format('YYYY-MM-DD') != end.format('YYYY-MM-DD')) {
      if (canCreateCycle(start, end)) {
        renderCycle(start, end);
      }
    }
    // if (start.isSameOrAfter(moment(today), 'day')) {
    //
    // }
    // if (!hasCycle() && today.diff(start) < 0) {
    //   $('#calendar').fullCalendar('renderEvent', {
    //     title: 'Cycle from ' + start.format('YYYY-MM-DD') + ' to ' + end.subtract(1, 'seconds').format('YYYY-MM-DD'),
    //     start: start,
    //     end: end,
    //     type: 1,
    //     overlap: false,
    //     editable: false,
    //     backgroundColor: '#d32f2f',
    //     borderColor: '#d32f2f',
    //   }, true);
    // }
  },
  dayClick: function(start) {
    var cycleId, dayDishes;

    if (canCreateCycle(start)) {
      renderCycle(start);
      // $('#calendar').fullCalendar('renderEvent', {
      //   title: 'From ' + start.format('YYYY-MM-DD') + ' to ' + start.format('YYYY-MM-DD'),
      //   start: start,
      //   // end: start,
      //   type: 1,
      //   overlap: false,
      //   editable: false,
      //   backgroundColor: '#d32f2f',
      //   borderColor: '#d32f2f',
      // }, true);
    } else {
      cycleId = getCycleId(start);
      $('.dish-list').empty();
      $('#dish-add').show();
      $('#dish-update').hide();
      $('#dish-cancel-update').hide();
      $('#dish-title').val('');
      $('#dish-description').val('');
      dayDishes = [];
      dayDishes = $.grep(allCycles[cycleId].dishes, function(o) {
        return o.start.format('YYYY-MM-DD') == start.format('YYYY-MM-DD');
      });
      $.each(dayDishes, function(i, o) {
        $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + o.title + '" data-description="' + o.description + '" data-id="' + o.id + '">' + o.title + '</a><a href="#" class="dish-delete" data-id="' + o.id + '"><span class="glyphicon glyphicon-trash"></span></a></li>');
      });
      $('#modalDish').modal('show');
    }

    // if (canCreate(start)) {
    //   dishDay = start;
    //   $('.dish-list').empty();
    //   $('#dish-add').show();
    //   $('#dish-update').hide();
    //   $('#dish-cancel-update').hide();
    //   $('#dish-title').val('');
    //   $('#dish-description').val('');
    //   var dayDishes = [];
    //   dayDishes = $.grep(currentCycle.dishes, function(o) {
    //     return o.start.format('YYYY-MM-DD') == start.format('YYYY-MM-DD');
    //   });
    //   $.each(dayDishes, function(i, o) {
    //     $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + o.title + '" data-description="' + o.description + '" data-id="' + o.id + '">' + o.title + '</a><a href="#" class="dish-delete" data-id="' + o.id + '"><span class="glyphicon glyphicon-trash"></span></a></li>');
    //   });
    //   $('#modalDish').modal('show');
    //   $('#dish-add').off().on('click', function() {
    //     dishForm.validate();
    //     if (dishForm.valid()) {
    //       var dish = {
    //         title: $('#dish-title').val(),
    //         description: $('#dish-description').val(),
    //         start: start.add(1, 'seconds'),
    //         type: 9,
    //         overlap: false,
    //         editable: false,
    //         backgroundColor: '#ff9800',
    //         borderColor: '#ff9800',
    //       }
    //       $.ajax({
    //         url: constants().dishRegister + '?token=' + $.cookie('token'),
    //         method: 'post',
    //         data: {
    //           title: dish.title,
    //           description: dish.description,
    //           id_provider: 1
    //         },
    //         success: function(data) {
    //           dish.id = data.data.id;
    //           $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + dish.title + '" data-description="' + dish.description + '" data-id="' + dish.id + '">' + dish.title + '</a><a href="#" class="dish-delete" data-id="' + dish.id + '"><span class="glyphicon glyphicon-trash"></span></a></li>');
    //           $('#calendar').fullCalendar('renderEvent', dish, true);
    //           currentCycle.dishes.push(dish);
    //           console.log('pushed');
    //           $('#dish-title').val('').focus();
    //           $('#dish-description').val('');
    //         },
    //         error: function(error) {
    //           console.log(error);
    //         }
    //       });
    //     }
    //   });
    // }
  },
  eventClick: function(event) {
    console.log(event);
    if (event.type == 1) {
      swal({
        html: '<span class="delete-dish">You are about to delete the current period.<br>Are you sure?</span>',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then(function () {
        $.ajax({
          url: constants().cycleDelete + '/' + event.id + '?token=' + $.cookie('token'),
          method: 'delete',
          dataType: 'json',
          success: function(data) {
            console.log(data.message);
            swal({
              title: 'The period was deleted.',
              imageUrl: 'assets/Congratulations.png'
            }).then(function() {
              location.reload();
            });
          }
        });
      }, function(){});
    }
  }
});

dishForm.validate({
  onblur: false,
  onfocus: false,
  rules: {
    'dish-title': {required: true},
    'dish-description': {required: true}
  },
  messages: {
    'dish-title': {required: 'Title must have a value.'},
    'dish-description': {required: 'Description must have a value'}
  }
});

// Depricated
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

// Depricated
function canCreate(start) {
  return hasCycle() && moment(start.format('YYYY-MM-DD')).isBetween(currentCycle.start.format('YYYY-MM-DD'), currentCycle.end.format('YYYY-MM-DD'), null, '[]');
}

// Depricated
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

function canCreateCycle(start, end) {
  var _start = start.format('YYYY-MM-DD'),
    _end = end ? end.format('YYYY-MM-DD') : start.format('YYYY-MM-DD'),
    _today = moment(today).format('YYYY-MM-DD'),
    res = true, _os, _oe;

  if (_start < _today) {
    swal({
      title: 'Sorry!',
      text: 'You can\'t create a cycle with this start date. (' + _start + ')',
      imageUrl: 'assets/warning_1.png',
      confirmButtonText: 'Ok'
    });
    return false;
  }
  $.each(allCycles, function(i, o) {
    _os = o.start.format('YYYY-MM-DD');
    _oe = o.end.format('YYYY-MM-DD');
    if (moment(_start).isBetween(_os, _oe, null, '[]') ||
      moment(_end).isBetween(_os, _oe, null, '[]') ||
      (moment(_start).diff(_os, 'days') < 0 && moment(_end).diff(_oe, 'days') > 0)) {
        res = false;
        return res;
    }
  });
  return res;
}

function renderCycle(start, end) {
  var _end = end ? end : start;
  var _cycle = {
    title: 'From ' + start.format('YYYY-MM-DD') + ' to ' + _end.format('YYYY-MM-DD'),
    start: start,
    end: _end,
    dishes: [],
    type: 1,
    overlap: false,
    editable: false,
    backgroundColor: cycleColor,
    borderColor: cycleColor
  }
  allCycles.push(_cycle);
  currentCycleId = allCycles.length-1;
  $('#date-selection').modal({
    show: true,
    // keyboard: false,
    // backdrop: 'static'
  });
  $('#calendar').fullCalendar('renderEvent', _cycle, true);
}

function getCycleId(start) {
  var _os, _oe, _id;

  $.each(allCycles, function(i, o) {
    _start = start.format('YYYY-MM-DD');
    _os = o.start.format('YYYY-MM-DD');
    _oe = o.end.format('YYYY-MM-DD');
    if (moment(_start).isBetween(_os, _oe, null, '[]')) {
      _id = i;
      return false;
    }
  });
  return _id;
}

$(".btn-limit-time").on("click", function() {
  allCycles[currentCycleId].limit = moment($("#limit-time2").val()).format('YYYY-MM-DD hh:mm:00');
  $("#limit-time2").val('');
  $("#date-selection").modal('hide');
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
  dishForm.validate();
  if (dishForm.valid()) {
    $.ajax({
        url: constants().dishUpdate + '/' + dishUpdateId + '?token=' + $.cookie('token'),
        method: 'put',
        data: {
          id: dishUpdateId,
          title: $('#dish-title').val(),
          description: $('#dish-description').val()
        },
        success: function(data) {

          swal({
            text: 'Dish has been updated',
            imageUrl:'assets/Congratulations.png',
            confirmButtonText: 'Ok'
          });

          $('.dish-list').empty();

          $.map(currentCycle.dishes, function(o) {
            if (o.id == dishUpdateId) {
              o.title = $('#dish-title').val();
              o.description = $('#dish-description').val();
            }
          });

          dayDishes = $.grep(currentCycle.dishes, function(o) {
            return o.start.format('YYYY-MM-DD') == dishDay.format('YYYY-MM-DD');
          });
          $.each(dayDishes, function(i, o) {
            $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + o.title + '" data-description="' + o.description + '" data-id="' + o.id + '">' + o.title + '</a><a href="#" class="dish-delete" data-id="' + o.id + '"><span class="glyphicon glyphicon-trash"></span></a></li>');
          });

          $('#dish-update').hide();
          $('#dish-cancel-update').hide();
          $('#dish-add').show();
          $('#dish-title').val('').focus();
          $('#dish-description').val('');
        }
      });
  }
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
  console.log(currentCycle);
  if (currentCycle.dishes) {
    if ($('#limit-time').val() != '') {
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

      // Validate if cycle is complete
      if (currentCycle.end.diff(currentCycle.start, 'days')+1 > theDishes.length) {
        swal({
          html: '<span class="delete-dish">There are some days without dishes.<br>Are you sure you want to continue?</span>',
          imageUrl:'assets/warning_1.png',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then(function () {
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
            limit: moment.utc($('#limit-time').val()).format('YYYY-MM-DD hh:mm:ss a'),
            data: theDishes,
          }

          $.ajax({
            url: constants().cycleRegister + '?token=' + $.cookie('token'),
            method: 'post',
            data: cycle,
            dataType: 'json',
            success: function(data) {
              swal(
                'Saved!',
                'The changes you made to your cycle has been saved successfully.',
                'success');
            }
          });
        }, function(){});
      } else {
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
          limit: moment.utc($('#limit-time').val()).format('YYYY-MM-DD hh:mm:ss a'),
          data: theDishes,
        }

        $.ajax({
          url: constants().cycleRegister + '?token=' + $.cookie('token'),
          method: 'post',
          data: cycle,
          dataType: 'json',
          success: function(data) {
            swal({
              title: 'Saved',
              text: 'The changes you made to your cycle has been saved successfully.',
              imageUrl:'assets/Congratulations.png',
              confirmButtonText: 'Ok'});
          }
        });
      }
    } else {
      swal({
        title: 'Error',
        text: 'You have not set the limit time of the period.',
        imageUrl:'assets/error.png',
        confirmButtonText: 'Ok'
      });
    }
  } else {
    swal({
    title: 'Error',
    text: 'You have not set any period',
    imageUrl:'assets/error.png',
    confirmButtonText: 'Ok'
    });
  }
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
  var idDel = $(this).data('id');
  swal({
    html: '<span class="delete-dish">You are about to remove a dish from the menu<br><br>Are you sure?</span>',
    imageUrl:'assets/warning_1.png',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then(function () {
    swal({
      text: 'The dish was removed successfully!',
      imageUrl:'assets/Congratulations.png',
      confirmButtonText: 'Ok'
    });
    $.each(currentCycle.dishes, function(i, o) {
      if (o.id == idDel && o.start.format('YYYY-MM-DD') == dishDay.format('YYYY-MM-DD')) {
        currentCycle.dishes.splice(i, 1);
        return false;
      }
    });

    $('.dish-list').empty();

    dayDishes = $.grep(currentCycle.dishes, function(o) {
      return o.start.format('YYYY-MM-DD') == dishDay.format('YYYY-MM-DD');
    });

    $.each(dayDishes, function(i, o) {
      $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + o.title + '" data-description="' + o.description + '" data-id="' + o.id + '">' + o.title + '</a><a href="#" class="dish-delete" data-id="' + o.id + '"><span class="glyphicon glyphicon-trash"></span></a></li>');
    });
  }, function() {});
});

$('#limit-time2').datetimepicker({
	dateFormat: 'yy-mm-dd',
  showSeconds: false,
  // timeFormat: 'hh:mm'
});

// Defaults
$('.navContainer__logo').addClass('navContainer__logo--center');
$('#dish-update').hide();
$('#dish-cancel-update').hide();
