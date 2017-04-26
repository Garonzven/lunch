$(document).ready(function() {
  $.ajax({
    url: 'profile.json',
    method: 'get',
    data: {
        token: $.cookie("token")
    },
    dataType: 'json',
    success: function(data) {
    	switch (data.id_profile) {
    		case 1:
    		case 3:
                $(".navContainer__logo").addClass("navContainer__logo--center");
                if (data.id_profile == 1) {
                    url = "menu_admin.html";
                    dashboard = "welcome.html";
                } else {
                    url = "menu_watcher.html";
                }
                $.ajax({
                    url: url,
                    method: "get",
                    dataType: "text",
                    success: function(response) {
                        $(".sidebar-nav").html(response);
                        $.ajax({
                            url: dashboard,
                            method: "get",
                            type: "text",
                            success: function(response) {
                                $(".container").html(response);
                            }
                        });
                    }
                });
    			break;

    		case 2:
    			$(".hamburger").remove();
    			break;
    	}
        $("#fullname").text(data.name);
    	$("#name").text(data.name.split(" ")[0]);
    }
  });
});
