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

$(".navContainer__logo").addClass("navContainer__logo--center");
$("#welcome-go").on("click", function() {
  $(location).attr("href", "menus_manage.html");
});
