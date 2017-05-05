// Load profile
$.ajax({
  url: constants().profile + '?token=' + $.cookie('token'),
  method: 'get',
  data: {
    token: $.cookie('token')
  },
  dataType: 'json',
  success: function(data) {
    switch (data.code) {
      case '200':
        console.log(data.user);
        $('#fullname').text(data.user.name);
        $('.full-name').text(data.user.name);

        $.ajax({
          url: 'menu_admin.html',
          method: 'get',
          dataType: 'text',
          success: function(data) {
        $('.sidebar-nav').load('menu_admin.html');
          }
        });
        break;

      case 400:
        $(location).attr('href', 'login.html');
        break;
    }
  }
});

function close(e){
  console.log(e);
  console.log($(e).closest('modal').attr('id'));
}




function deleteFom(button){
  swal({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(function () {
    var email = $(button).attr('id');
    console.log(email);
    var url = constants().userDelete + '?token='+$.cookie('token');
    $.ajax({
      url: url,
      method: 'DELETE',
      data:{
        email:email
      },
      dataType: 'JSON',
      success: function(data){
        switch (data.code) {
          case "200":
            swal({
            text: data.message,
            type: 'success',
            confirmButtonText: 'Ok'
          }).then(
            function(){
               setTimeout(function () { location.reload(true); }, 100);
            }
          )
          break;

          case "404":
          swal({
          text: data.message,
          type: 'error',
          confirmButtonText: 'Ok'
          });
          break;

        }
      },
      error: function(res) {

        console.log(res);
      }
    });
  })
}


$('.modal').on('hidden.bs.modal', function (e) {
  console.log('hola');
})

function submitForm(button){
  var formid = $(button).closest('form').attr('id');
  var datos = $('#'+formid).serializeArray();
  var data = '';
  $.each(datos, function (key, val) {
    switch(val.name){
      case 'name':
      name = val.value
      break;
      case 'emailold':
      emailold = val.value
      break;
      case 'emailnew':
      emailnew = val.value
      break;
      case 'jobtitle':
      jobtitle = val.value
      break;
      case 'city':
      city = val.value
      break;
      case 'country':
      country = val.value
      break;
      case 'phone':
      phone = val.value
      break;
      case 'id_profile':
      id_profile = val.value
      break;
    }
  });
  var url = constants().userUpdate + '?token='+$.cookie('token');
  $.ajax({
    url: url,
    method: 'PUT',
    data:{
      name: name,
      phone: phone,
      emailnew: emailnew,
      emailold: emailold,
      city: city,
      country: country,
      photo: 'asdasdasd',
      jobtitle: jobtitle,
      id_profile:id_profile
    },
    dataType: 'JSON',
    success: function(data){
      switch (data.code) {
        case '200':
          swal({
          text: data.message,
          type: 'success',
          confirmButtonText: 'Ok'
          }).then(
            function(){
            console.log("hola");
            setTimeout(function () { location.reload(true); }, 500);
          }
        );
        break;

        case '404':
        swal({
        text: data.message,
        type: 'error',
        confirmButtonText: 'Ok'
        });
        break;

      }
    },
    error: function(res) {

      console.log(res);
    }
  });
}

function cancelEdit(button){
  var formid = $(button).closest('form').attr('id');
  $('#'+formid+' input').each(function(){
      $(this).attr('disabled', true);
  });
  $('#'+formid+' select').each(function(){
      $(this).attr('disabled', true);
  });
  $('#'+formid+' .ok').addClass('show-btn').removeClass('hide-btn');
  $('#'+formid+' .update').addClass('hide-btn').removeClass('show-btn');
  $(button).addClass('hide-btn');
}

function editForm(button){
  var formid = $(button).closest('form').attr('id');
  $('#'+formid+' input').each(function(){
      $(this).attr('disabled', false);
  });
  $('#'+formid+' select').each(function(){
      $(this).attr('disabled', false);
  });

  $('#'+formid+' .ok').removeClass('show-btn').addClass('hide-btn');
  $('#'+formid+' .update').removeClass('hide-btn').addClass('show-btn');
  $('#'+formid+' .cancel').removeClass('hide-btn').addClass('show-btn');
}

$('document').ready(function(){
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
  var d = new Date();
  var n = monthNames[d.getMonth()]+', '+d.getDate()+' '+d.getFullYear();
  $('.fecha').html(n);


  function viewRole(id){
    switch (id) {
      case 1:
      return 'Administrator';
      break;
      case 2:
      return 'User';
      break;
      case 3:
      return 'Watcher';
      break;
    }
  }



  function createModal(id,name,email,phone,jobtitle,city,country,id_profile){
    var modal;
    modal = '<div class="modal modal--top fade" id="modal_'+id+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">';
    modal += '<form id="updateUser'+id+'" class="col-xs-12">';
    modal += '<div class="modal-dialog modal-dialog--admin" role="document">';
    modal += '<div class="modal-content modal-content--admin">';
    modal += '<div class="modal-header modal-header--admin">';
    modal += '<button type="button" id="'+email+'" class="del close pull-right del-modal--admin" aria-label="edit" onclick="deleteFom(this)"><span class=" glyphicon glyphicon-trash" aria-hidde"true"></span></button>'
    modal += '<button type="button" id="edit'+id+'" class="edit close pull-right edit-modal--admin" aria-label="edit" onclick="editForm(this)"><span class=" glyphicon glyphicon-pencil" aria-hidde"true"></span></button>'
    modal += '<button type="button" class="close" onclick="close(this)" data-dismiss="modal" aria-label="Close"><span class="close-modal--admin" aria-hidden="true">&times;</span></button>';
    modal += '<input type="text" class="modal-title loginBox__title--modal form-control form-control--input input disable-input" id="name" name="name" value="'+name+'" disabled="">';
    modal += '</div>'
    modal += '<div class="modal-body modal-body--pad">';
    modal += '<div class="container"><div class="col-xs-5">';
    modal +='<div class="form-group"><label for="" class="label__modal">Email:</label><input type="text" class="form-control form-control--input input input--modal disable-input" name="emailnew" value="'+email+'" d  disabled=""></div>';
    modal += '<div class="form-group"><label for="" class="label__modal">Phone:</label><input type="text" class="form-control form-control--input input input--modal disable-input" id="phone" name="phone" value="'+phone+'"  disabled=""></div>';
    modal += '<div class="form-group"><label for="" class="label__modal">Job Title:</label><input type="text" class="form-control form-control--input input input--modal disable-input"  name="jobtitle" id="jobtitle" value="'+jobtitle+'"  disabled=""></div>';
    modal += '<div class="form-group"><label for="" class="label__modal">City:</label><input type="text" class="form-control form-control--input input input--modal disable-input" name="city" id="city" value="'+city+'"  disabled=""></div>';
    modal += '<div class="form-group"><label for="" class="label__modal">Country:</label><input type="text" class="form-control form-control--input input input--modal disable-input" name="country" id="country" value="'+country+'"  disabled=""></div>';
    modal += '<div class="form-group"><label for="" class="label__modal">Role</label>';
    modal += '<select class="form-control form-control--select select--modal disable-select" disabled="" id="id_profile" name="id_profile">'
    switch (id_profile) {
      case 1:
        modal += ' <option selected value="1">Admin</option>';
        modal += ' <option value="2">User</option>';
        modal += '<option value="3">Wacher</option>';
      break;
      case 2:
        modal += ' <option value="1">Admin</option>';
        modal += ' <option selected value="2">User</option>';
        modal += '<option value="3">Wacher</option>';
      break;
      case 3:
      modal += ' <option value="1">Admin</option>';
      modal += ' <option value="2">User</option>';
      modal += '<option selected value="3">Wacher</option>';
      break;
    }

    modal+= '</select></div>';
    modal += '<input type="hidden" name="emailold" id="emailold" value="'+email+'"/>';
    modal += '</div>';
    modal += '<div class="col-xs-2">';
    modal += '<div class="form-group"><label for="" class="label__modal">Picture:</label><img src="images/user-01.png" alt="" class="img-responsive img--form"></div>';
    modal += '<button type="button" onclick="cancelEdit(this)" id="cancel'+id+'" class="hide-btn btn btn--red btn--modal pull-right radius cancel m-t-70">Cancel</button>';
    modal += '<button type="button" onclick="close('+id+')" id="ok'+id+'" class="show-btn btn btn--green btn--modal pull-right radius ok m-t-70 ">Ok</button>';
    modal += '<button type="button" onclick="submitForm(this);" id="update'+id+'" name="update" class="hide-btn btn btn--yellow btn--fs15 btn--modal pull-right radius update" style="margin-top:10px;" >Save</button>';
    modal += '</div></div></div></div></div></div></div></form></div>';
    return modal;
   }

  $.ajax({
    url: 'http://13.92.198.201/laravel/public/user/findlist?token='+$.cookie('token'),
    method: 'GET',
    dataType: 'JSON',
    success: function(data){
      $.each(data.data, function (key, data) {
        $('.modales').append(createModal(data.id,data.name,data.email,data.phone,data.jobtitle,data.city,data.country,data.id_profile));
        $('#user-detail').append('<a href=\'#\'><tr id=\''+data.email+'\' data-toggle=\'modal\'  data-target=\'#modal_'+data.id+'\'> <td align=\'center\'>'+data.name+'</td><td align=\'center\'>'+data.email+'</td><td align=\'center\'>'+data.created_at+'</td> <td align=\'center\'>'+viewRole(data.id_profile)+'</td></tr></a>');
      });
    $('#example').dataTable();
    }
  });


  $('#createForm').validate({
        rules: {
          // simple rule, converted to {required:true}
          name: {
            required:true
          },
          phone: {
            required:true
          },
          jobtitle: {
            required:true
          },
          city: {
            required:true
          },
          country: {
            required:true,
          },
          email: {
            required: true,
            email: true
          },
          id_profile: {
            required: true,
          }
        },

        submitHandler: function(form){

          $.ajax({
            url: constants().userRegister + '?token='+$.cookie('token'),
            method: 'POST',
            data: {
              name: $('#name').val(),
              phone: $('#phone').val(),
              jobtitle: $('#jobtitle').val(),
              city: $('#city').val(),
              country: $('#country').val(),
              email: $('#email').val(),
              photo: 'asdasdasd',
              id_profile: $('#id_profile').val(),
            },
            dataType: 'JSON',
            success: function(data) {
              console.log(data);
              switch (data.code) {
                case '201':
                  swal({
                  text: data.message,
                  type: 'success',
                  confirmButtonText: 'Ok'
                }).then( function(){
                  setTimeout(function () { location.reload(true); }, 10000);
                });
                break;

                case '404':
                swal({
                text: data.message,
                type: 'error',
                confirmButtonText: 'Ok'
                });
                setTimeout(function () { location.reload(true); }, 5000);
                break;
              }
            }
          });
        }
      });
    });
