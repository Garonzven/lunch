$('document').ready(function(){
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
  var d = new Date();
  var n = monthNames[d.getMonth()]+', '+d.getDate()+' '+d.getFullYear();
  $('.fecha').html(n);


  $(document).ready(function() {
    $('#example').DataTable( {
        'ajax': 'user.json',
        'columns': [
            { 'name': 'Name', 'data': 'name' },
            { 'name': 'Creation date', 'data': 'created_at' },
            { 'name': 'Role', 'data': 'id_profile' }
        ]
    } );
} );


});

$(document).ready(function () {
    // Dropzone.autoDiscover = false;
    // $("#dZUpload").dropzone({
    //     url: "hn_SimpeFileUploader.ashx",
    //     addRemoveLinks: true,
    //     success: function (file, response) {
    //         var imgName = response;
    //         file.previewElement.classList.add("dz-success");
    //         console.log("Successfully uploaded :" + imgName);
    //     },
    //     error: function (file, response) {
    //         file.previewElement.classList.add("dz-error");
    //     }
    // });

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
            url: 'http://13.92.198.201/laravel/public/user/register',
            method: 'post',
            data: {
              token: $.cookie(token),
              name: $('#name').val(),
              phone: $('#phone').val(),
              jobtitle: $('#jobtitle').val(),
              city: $('#city').val(),
              country: $('country').val(),
              email: $('#email').val(),
              id_profile: $('#id_profile').val(),
            },
            dataType: 'JSON',
            success: function(data) {
              console.log(data);
              // switch (data.code) {
              //   case 200:
              //     swal({
              //     text: data.message,
              //     type: 'success',
              //     confirmButtonText: 'Ok'
              //     });
              //   break;
              //
              //   case 404:
              //   swal({
              //   text: data.message,
              //   type: 'error',
              //   confirmButtonText: 'Ok'
              //   });
              //   break;
              // }
            }
          });
          // event.preventDefault();
        }
      });

});
