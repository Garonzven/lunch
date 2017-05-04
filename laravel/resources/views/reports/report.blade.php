<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" media="screen" href="/css/main.css">
    <title>Reports Lunch</title>
    <style>
      .loginBox__title {
        font-size: 24px;
        color: #d32f2f;
        font-weight: 700;
      }
      .loginBox__title--black {
        font-size: 24px;
        /*color: #000000;
        font-weight: 700;*/
        text-align: center !important;
      }
       .hr-size-black {
           background-color: rgba(33, 33, 33, 0.36);;
           height: 2px;
           margin-top: 0px;
           margin-bottom: 30px;
           border: 0;
           border-top: 0px;
       }
       .hr-size-tableleft{
           background-color:rgba(33, 33, 33, 0.36) ;
           height: 2px;
           width: 160px;
           margin-bottom: 3px;
           
       }
       .hr-size-tablerigth{
           background-color:rgba(33, 33, 33, 0.36) ;
           height: 2px;
           width: 160px;
           margin-bottom: 3px;
           
       }
       .navbar-pdf{
         width: 100%;
         height: 70px;
         background-color:#d32f2f;
       }
       .img-pdf{
         margin-left: 20px;
         
       }
       .img-logo{
            width: 23px;
            height: 22px;
            margin-top: 4px
       }
       .p-der{

         position: relative;
         left: 57%;
       }
       .container-pa{
         padding-top: 100px;
       }
       .table>thead>tr>th {
        vertical-align: bottom;
        /* border-bottom: 2px solid #ddd; */
    }
       head:before, thead:after,
    tbody:before, tbody:after,
    tfoot:before, tfoot:after
    {
        display: none;
    }
   </style>
  </head>
  <body>
      <nav class="navbar-pdf">
        <img class="img-pdf" src="images/logo.png" alt="Logo">
      </nav>
      <div style="margin-bottom:100px;"></div>
      <div style="margin-left: 45%;">
         <img class="img-logo" src="images/icono_menu.png" alt="Logo">
          <span class="loginBox__title">REPORTS</span>
      </div>
     
      <hr class="hr-size-black">
      <p style="font-size: 18px;">Period: {{$init->initial}} To {{$close->closing}} </p>
      <table class="table table-bordered">
        <thead>
          <tr style="background-color:#fdc113">
            <th align="center"><p style="text-align: center; color:#ffffff;">DAY</p></th>
            <th align="center"><p style="text-align: center;color:#ffffff;">DISH</p></th>
            <th align="center"><p style="text-align: center;color:#ffffff;">TOTAL</p></th>
          </tr>
        </thead>
        <tbody>
          @foreach($dishes as $key)
              <tr>
                <td align="center">{{$key->day}} <br> {{$key->date_cycle}} </td>
                <td>
                @foreach($key->dish as $val)
                {{$val->title}}<br>
                @endforeach
                </td>
                <td align="center">
                @foreach($key->dish as $val)
                {{$val->count}}<br>
                @endforeach
                </td>
                 <tr>
                  <td colspan="2" align="right"><b>Total dishes: </b></td>
                  <td align="center"><b>{{$key->daycount}}</b></td>
                </tr>
              </tr>
          @endforeach
              <tr style="border:none !important;">
                  <td colspan="2" align="right"><b style="font-size:18px;">Total week&#39s dishes: </b></td>
                  <td align="center"><b>{{$sum}}</b></td>
              </tr>
        </tbody>
      </table>
     <table class="table" style="margin-bottom:20px !important;">
       <thead>
          <tr>
            <th style="border-bottom:none !important;"><hr class="hr-size-tableleft">
            <p style="text-align:center;font-size: 20px;color:rgba(33, 33, 33, 0.36);">Send</p></th>
            <th style="border-bottom:none !important;""><hr class="hr-size-tablerigth">
            <p  style="text-align:center !important;font-size: 20px;color:rgba(33, 33, 33, 0.36);">Received</p></th>
          </tr>
        </thead>
     </table>
     
      <div>
        <p class="loginBox__title--black">GARONZ</p>
        <p style="text-align: center;">5 de Julio, Edificio Befercom.</p>
        <p style="text-align: center;">0412-6459052</p>
      </div>
      
      



      <div class="container container-pa">
        <div class="row">

      </div>
    </div>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
      <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
  </body>
</html>
