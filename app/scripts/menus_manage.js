$.ajax({
  url: "login.json",
  method: "get",
  data: {
    token: $.cookie("token")
  },
  dataType: "json",
  success: function(data) {
    switch (data.code) {
      case 200:
        $("#fullname").text(data.user.name);
        $.ajax({
          url: "menu_admin.html",
          method: "get",
          dataType: "text",
          success: function(data) {
            $(".sidebar-nav").html(data);
          }
        });
        break;

      case 400:
        $(location).attr("href", "login.html");
        break;
    }
  }
});

function hasEvents(date) {
    let events = [];
    events = $("#calendar").fullCalendar("clientEvents");
    let event = $.grep(events, function(v) {
      return +v.start === +date;
    });
    return event.length > 0;
}

$(".navContainer__logo").addClass("navContainer__logo--center");

$("#calendar").fullCalendar({
  header: {
    left: "",
    center: "title"
  },
  eventLimit: true,
  editable: true,
  selectable: true,
  select: function(start, end) {
    let cycle = {
      title: "Cycle from " + start.format("YYYY-MM-DD") + " to " + end.format("YYYY-MM-DD"),
      start: start,
      end: end
    }
    $("#calendar").fullCalendar("renderEvent", cycle, true);
  },
  dayClick: function(start) {
    console.log(start.format("YYYY-MM-DD"));
    // $("#modalDish").modal("show");
  },
  eventResize: function(event, delta) {
    console.log(event.start.format("YYYY-MM-DD"), delta);
  }
});
