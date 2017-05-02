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
        color: #000000;
        font-weight: 700;
      }
       .hr-size-black {
           background-color: black;
           height: 2px;
           margin-top: 0px;
           margin-bottom: 30px;
           border: 0;
           border-top: 0px;
       }
       .navbar-pdf{
         width: 100%;
         height: 70px;
         background-color:#d32f2f;
       }
       .img-pdf{
         position: relative;
         float: right;
         right: 110px;
       }
       .p-der{
         position: relative;
         left: 57%;
       }
       .container-pa{
         padding-top: 100px;
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
      <i class="glyphicon glyphicon-file" aria-hidden="true"></i><span class="loginBox__title">REPORTS</span>
      <hr class="hr-size-black">
      <span class="loginBox__title--black">GARONZ</span>
      <p>5 de Julio, Edificio Befercom.</p>
      <p>0412-6459052</p>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>DAY</th>
            <th>DISH</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          @foreach($dishes as $key)
              <tr>
                <td>{{$key->day}} <br> {{$key->date_cycle}}</td>
                <td>
                @foreach($key->dish as $val)
                {{$val->title}}<br>
                @endforeach
                </td>
                <td>
                @foreach($key->dish as $val)
                {{$val->count}}<br>
                @endforeach
                </td>
              </tr>
          @endforeach
        </tbody>
      </table>
      <div class="container container-pa">
        <div class="row">

      </div>
    </div>
        <p class="p-der">TOTAL FOOD DISHES:<span style="text-decoration:underline;">{{$sum}}</span></p>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
      <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
  </body>
</html>
