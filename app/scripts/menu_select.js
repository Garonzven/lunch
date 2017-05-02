$('document').ready(function(){
  $.ajax({
    url:'cycleactive.json',
    type:'get',
    dataType:'JSON',
    success: function(data){
      console.log(data);
      $.each(data.data.dishes,function(key,data){
        console.log(data.id_dish);
      });
    }
  });
});
