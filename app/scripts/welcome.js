$.ajax({
  url: "login.json",
  method: "get",
  data: {
    token: $.cookie("token#")
  },
  dataType: "text",
  success: function(response) {
    $(".sidabar-nav").html()
  }
})
$("#welcome-go").on("click", function() {
  $(location).attr("href", "menus_manage.html");
});
