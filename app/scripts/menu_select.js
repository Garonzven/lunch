function formatDate(date) {
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var d = new Date(date);
  var n = monthNames[d.getMonth()]+', '+d.getDate();
  return n;
}

function formatId(date){
  var d = new Date(date);
  var n = d.getMonth()+'.'+d.getDate()+'.'+d.getFullYear();
  return n;
}

$('document').ready(function(){
  $.ajax({
    url:'cycleactive.json',
    type:'get',
    dataType:'JSON',
    success: function(data){
    date = "";
      $.each(data.data.dishes,function(key,data){
        if(date != data.date_cycle){
          day = formatDate(data.date_cycle);
          cid = formatId(data.date_cycle);
          $('.ciclo').append('<li class="'+cid+' ciclo-day">'+formatDate(data.date_cycle)+'<div class="ciclo-status"></div></li>');
        }
        console.log(data);
         $('.menus').append('<div class="'+cid+' col-sm-6 col-md-4"><div class="thumbnail thumbnail-menu"><div class="caption"><input type="hidden" id="dish" value="'+data.id_dish+'"></input><p class="title-menu">'+data.title+'</p><p class="text-justify thumbnail-desc">'+data.description+' </p><p class="put-bottom"><a href="#" class="btn btn--yellow pull-right" role="button">Select</a> </p></div></div></div>');
        date = data.date_cycle;
      });

    }
  });
});
