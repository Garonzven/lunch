$(document).ready(function() {
  $.ajax({
    url: 'profile.json',
    method: 'get',
    dataType: 'json',
    success: function(data) {   
    	switch (data.id_profile) {
    		case 1:
    		case 3:
    			if (data.id_profile == 1) {
    				url = "menu_admin.html";
    			} else {
    				url = "menu_watcher.html";
				}   				
				$.ajax({
					url: url,
					method: "get",
					dataType: "text",
					success: function(response) {
						$(".sidebar-nav").html(response);    				
					}
				}); 
    			break;

    		case 2:
    			$(".hamburger").remove();
    			break;
    	}
    	$("#name").text(data.name.split(" ")[0]);
    }
  });
});
