// Globals variables ***********************************************************
var today,
  allCycles = [],
  cycleColor = '#d32f2f',
  dishColor = '#ff9800',
  closedColor = '#757575',
  currentCycleId,
  dishDay,
  dishForm = $('#dish-form'),
  dayDishes = [],
  dishUpdateId,
  theDishes,
  loaded = false,
  travel = 0,
  deleteCycleId,
  changeLimit = false,
  currentLimit;



// AJAX ***********************************************************
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
      case 401:
        $(location).attr('href', 'login.html');
        break;
    }
  }
});

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
          o.title = title;
          o.start = start;
          o.end = end;
          o.type = o.active;
          o.overlap = false;
          o.editable = false;
          o.backgroundColor = o.active == 0 ? closedColor : cycleColor;
          o.borderColor = o.active == 0 ? closedColor : cycleColor;
          o.limit = o.limit_date;

          // Flags for reports
          o.cycle_new = false;
          o.cycle_dishes = false;
          o.cycle_limit = false;
          o.cycle_delete = false;

          $.map(o.dishes, function(_o) {
            _o.id = _o.id_dish;
            _o.type = 9;
            _o.start = moment(_o.date_cycle);
            _o.backgroundColor = o.active == 0 ? closedColor : dishColor;
            _o.borderColor = o.active == 0 ? closedColor : dishColor;
            _o.overlap = false;
            _o.editable = false;
          });
        });
        $('#calendar').fullCalendar('renderEvents', allCycles, true);
        $.each(allCycles, function(i, o) {
          $('#calendar').fullCalendar('renderEvents', o.dishes, true);
        });
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
  },
  error: function(error) {
    console.log(error);
    switch (error.status) {
      case 400:
        $(location).attr('href', 'login.html');
        break;
    }
  }
});



// JQUERY METHODS ***********************************************************
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
  },
  dayClick: function(start) {
    if (canCreateCycle(start)) {
      renderCycle(start);
    } else {
      if (start.diff(moment(today), 'days') >= 0) {
        currentCycleId = getCycleId(start);
        dishDay = start;
        $('.dish-list').empty();
        $('#dish-add').show();
        $('#dish-update').hide();
        $('#dish-cancel-update').hide();
        $('#dish-title').val('');
        $('#dish-description').val('');
        dayDishes = [];
        dayDishes = $.grep(allCycles[currentCycleId].dishes, function(o) {
          return o.start.format('YYYY-MM-DD') == start.format('YYYY-MM-DD');
        });
        $.each(dayDishes, function(i, o) {
          $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + o.title + '" data-description="' + o.description + '" data-id="' + o.id + '">' + o.title + '</a><a href="#" class="dish-delete" data-id="' + o.id + '"><span class="glyphicon glyphicon-trash"></span></a></li>');
        });
        $('#modalDish').modal({
          show: true,
          keyboard: true,
          backdrop: 'static'
        });
        $('#dish-add').off().on('click', function() {
          dishForm.validate();
          if (dishForm.valid()) {
            var dish = {
              title: $('#dish-title').val(),
              description: $('#dish-description').val(),
              start: start.add(1, 'seconds'),
              type: 9,
              overlap: false,
              editable: false,
              backgroundColor: dishColor,
              borderColor: dishColor,
              cycle_id: currentCycleId
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
                $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + dish.title + '" data-description="' + dish.description + '" data-id="' + dish.id + '">' + dish.title + '</a><a href="#" class="dish-delete" data-id="' + dish.id + '"><span class="glyphicon glyphicon-trash"></span></a></li>');
                $('#calendar').fullCalendar('renderEvent', dish, true);
                allCycles[currentCycleId].dishes.push(dish);
                $('#dish-title').val('').focus();
                $('#dish-description').val('');
              },
              error: function(error) {
                console.log(error);
              }
            });
          }
        });
      }
    }
  },
  eventClick: function(event) {
    if (event.type == 1) {
      currentCycleId = getCycleId(event.start);
      deleteCycleId = event.id ? event.id : event._id;
      $('#limit-time2').val(moment(allCycles[currentCycleId].limit).format('YYYY-MM-DD HH:mm:ss'));
      $('#date-selection').modal({
        show: true,
        keyboard: true,
      });
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

$('#limit-time2').datetimepicker({
  dateFormat: 'yy-mm-dd',
  timeFormat: 'HH:mm:ss'
  // showSecond: false,
});



// Functions ***********************************************************
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
      confirmButtonText: 'Ok',
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
    borderColor: cycleColor,
    cycle_new: true, // No cambiará de ningun modo si se asigna 'true' en este punto
    cycle_limit: false,
    cycle_dishes: false,
    cycle_delete: false
  }
  allCycles.push(_cycle);
  currentCycleId = allCycles.length-1;
  $('#limit-time2').val('');
  $('#date-selection').modal({
    show: true,
    keyboard: true
  });
  $('#calendar').fullCalendar('renderEvent', _cycle, true);
  deleteCycleId = $('#calendar').fullCalendar('clientEvents', function(e) {
    return e.type == 1 && e.start.format('YYYY-MM-DD') == start.format('YYYY-MM-DD')
  })[0]._id;
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



// Events ***********************************************************
$('.btn-limit-time').on('click', function() {
  var curr = allCycles[currentCycleId];

  if ($('#limit-time2').val() != '') {
    curr.limit = moment($('#limit-time2').val()).format('YYYY-MM-DD HH:mm:ss');
    curr.limit_date = moment($('#limit-time2').val()).format('YYYY-MM-DD HH:mm:ss');
    if (!curr.cycle_new && !curr.cycle_limit && changeLimit && $('#limit-time2').val() != $('#limit-time2').data('oldvalue')) {
      curr.cycle_limit = true;
      changeLimit = false;
    }
    console.log(allCycles);
    $('#limit-time2').val('');
    $('#date-selection').modal('hide');
  }
});

$('#limit-time2').on('change', function() {
  $('.btn-limit-time').prop('disabled', '');
  if ($(this).val() != $(this).data('oldvalue')) {
    changeLimit = true;
  }
});

$('#limit-time2').on('focus', function() {
  $(this).data('oldvalue', $(this).val());
});

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
        $.map(allCycles[currentCycleId].dishes, function(o) {
          if (o.id == dishUpdateId) {
            o.title = $('#dish-title').val();
            o.description = $('#dish-description').val();
          }
        });
        dayDishes = $.grep(allCycles[currentCycleId].dishes, function(o) {
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

$('#modalDish').on('hidden.bs.modal', function(e) {
  $('#dish-ok').trigger('click');
});

$('#date-selection').on('shown.bs.modal', function(e) {
  $('.btn-limit-time').prop('disabled', 'disabled');
});

$('#dish-ok').on('click', function() {
  var del = $('#calendar').fullCalendar('clientEvents', function(e) {
    return e.type == 9 && e.start.format('YYYY-MM-DD') == dishDay.format('YYYY-MM-DD');
  });
  $.each(del, function(i, o) {
    $('#calendar').fullCalendar('removeEvents', o._id);
  });
  var a = $.grep(allCycles[currentCycleId].dishes, function(o, i) {
    return o.type == 9 && o.start.format('YYYY-MM-DD') == dishDay.format('YYYY-MM-DD');
  });
  $('#calendar').fullCalendar('renderEvents', a, true);
});

$('#delete-cycle').on('click', function() {
  swal({
    html: '<span class="delete-dish">You are about to delete a cycle.<br>Are you sure?</span>',
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then(function () {
    console.log(!isNaN(deleteCycleId));
    if (!isNaN(deleteCycleId) && deleteCycleId >= 0) {
      $.ajax({
        url: constants().cycleDelete + '/' + deleteCycleId + '?token=' + $.cookie('token'),
        method: 'delete',
        dataType: 'json',
        success: function(data) {
          console.log(data.message);
          swal({
            title: 'The cycle was deleted.',
            imageUrl: 'assets/Congratulations.png'
          }).then(function() {
            location.reload();
          });
        }
      });
    } else {
      $('#calendar').fullCalendar('removeEvents', function (e) {
        return e._id == deleteCycleId || e.cycle_id == currentCycleId;
      });
      allCycles.splice(currentCycleId, 1);
      $('#date-selection').modal('hide');
    }
  });
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
    $.each(allCycles[currentCycleId].dishes, function(i, o) {
      if (o.id == idDel && o.start.format('YYYY-MM-DD') == dishDay.format('YYYY-MM-DD')) {
        allCycles[currentCycleId].dishes.splice(i, 1);
        return false;
      }
    });
    $('.dish-list').empty();
    dayDishes = $.grep(allCycles[currentCycleId].dishes, function(o) {
      return o.start.format('YYYY-MM-DD') == dishDay.format('YYYY-MM-DD');
    });
    $.each(dayDishes, function(i, o) {
      $('.dish-list').append('<li><a href="#" class="dish-title" data-title="' + o.title + '" data-description="' + o.description + '" data-id="' + o.id + '">' + o.title + '</a><a href="#" class="dish-delete" data-id="' + o.id + '"><span class="glyphicon glyphicon-trash"></span></a></li>');
    });
  }, function() {});
});

$('#save-cycle').on('click', function() {
  var _ok = true,
  cycle = {},
  saveAll = false;

  $.each(allCycles, function(i, o) {
    if (!o.limit) {
      _ok = false;
      swal({
        title: 'Oops!',
        text: 'There is one or more cycles that don\'t have closing time, please check all cycles and set the closing time by clicking over red shape.',
        imageUrl: 'assets/warning_1.png',
        confirmButtonText: 'Ok'
      });
      return false;
    }
    if (_ok) {
      if (o.dishes.length == 0) {
        _ok = false;
        swal({
          title: 'Oops!',
          text: 'There is one or more cycles that don\'t have dishes, please check all cycles and set dishes to it.',
          imageUrl: 'assets/warning_1.png',
          confirmButtonText: 'Ok'
        });
        return false;
      }
    }
  });
  if (_ok) {
    travel = 0;
    $('.backdrop-save-cycles').css('display', 'flex');
    $.each(allCycles, function(i, o) {
      theDishes = [];
      $.each(o.dishes, function(_i, _o) {
        if (!dateExists(_o)) {
          theDishes.push({
            date_cycle: _o.start.format('YYYY-MM-DD'),
            id_dishes: []
          });
        }
      });
      $.each(theDishes, function(_i, _o) {
        $.each(o.dishes, function(__i, __o) {
          if (_o.date_cycle == __o.start.format('YYYY-MM-DD')) {
            _o.id_dishes.push(__o.id);
          }
        });
      });
      cycle = {
        init: o.start.format('YYYY-MM-DD'),
        close: o.end.format('YYYY-MM-DD'),
        limit: moment(o.limit).format('YYYY-MM-DD hh:mm:ss a'),
        data: theDishes
      }
      $.ajax({
        url: constants().cycleRegister + '?token=' + $.cookie('token'),
        method: 'post',
        data: cycle,
        dataType: 'json',
        success: function(data) {
          travel++;
        },
        error: function(error) {
          console.log(error);
          swal({
            title: 'Oops!',
            text: 'There was an internal error, please try again.',
            imageUrl: 'assets/error.png',
            confirmButtonText: 'Ok'
          });
          $('.backdrop-save-cycles').hide('fast');
        }
      });
    });
  }
});

$(document).ajaxStop(function() {
  if (travel == allCycles.length) {
    $('.backdrop-save-cycles').hide('fast');
    swal('Saved!',
    'The changes you made to your cycles have been saved successfully.',
    'success');
    travel = 0;
  }
});

$(window).scroll(function() {
  $('.backdrop-save-cycles').css('top', $(this).scrollTop()+'px');
});



// Defaults
$('.navContainer__logo').addClass('navContainer__logo--center');
$('#dish-update').hide();
$('#dish-cancel-update').hide();
