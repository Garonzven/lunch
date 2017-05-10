<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" media="screen" href="/css/main.css">-->
    <title>Recovery password</title>

  </head>
  <body>
    <nav style="top: 0;border-width: 0 0 1px;background-color: #ffffff !important;
  height: 70px;">
     <div style="padding-right: 15px;padding-left: 15px;margin-right: auto;margin-left: auto;">
   <!-- Brand and toggle get grouped for better mobile display -->
       <div style="margin-right: 0;margin-left: 0;">
         <a style="float: left;height: 50px;padding: 15px 15px;font-size: 18px;line-height: 20px;padding-top: 0;display: none;position: absolute !important;left: calc(10% - 70px) !important;display: block;bottom: 18px;"href="#">
           <img style="position: relative;height: 80px;width: 130px;bottom: 9px;left: 10px;" src="http://13.92.198.201/laravel/public/images/logo_horizontal_dark.png" alt="Logo">
         </a>
       </div>
     </div>
   </nav>
   <div style="padding-right: 15px; padding-left: 15px;margin-right: auto; margin-left: auto;">
     <div style="margin-right: -15px;margin-left: -15px;">
       <div style="padding-top:100px; text-align: center;">
         <hr style="background-color:#d32f2f;height: 2px;margin-top: 0px;margin-bottom: -10px;border: 0;border-top: 0px;position: relative;top:-25px;">
         <!--nombre aqui-->
         <p style="text-align:left;font-size: 36px;color: #d32f2f;font-weight: 700;margin-top: 0px;padding-bottom: 0px;">Hi {{$data->name}},</p>
         <h3>We received a request to reset your password for you</h3>
         <h3>Luch Time account.</h3>
         <!--Correo garonz aqui-->
         <h3 style="color:#d32f2f;"><b>{{$data->email}}</b></h3>
         <br>
         <h3>Easy! we know you are hungry! so we re here to help!</h3>
         <br>
         <h3><b>So, here is your provisional password:</b></h3>

         <div style="border: 1px solid #9e9e9e;width: 300px;margin:0 auto;">
           <!--passwor aqui-->
           <h3><b>{{$password}}</b></h3>
         </div>
         <br>
         <h3><b>Please click link below to log in wit your provisional password</b></h3>
           <a style="display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;background-color:#d32f2f;width: 500px;color: #ffffff;" href="http://13.92.198.201/login.html">Url</a>
         <p>If you didn't ask to chage your password don't worry! Your password is still safe</p>
         <p>and you can delete this mail.</p>
       </div>
       <h4 style="font-size:25px; margin-bottom:-30px;"><b>Bon Appetite!</b></h4>
       <h4  style="font-size:25px;"><b>The Lunch Time Team</b></h4>
     </div>
   </div>
   <footer style="background-color: #d32f2f;height: 44px;">
     <div style="padding-right: 15px;padding-left: 15px;margin-right: auto;margin-left: auto;">
       <h4 style="text-align: center; color:#ffffff;">Lunch Time - Garonz 2017</h4>
     </div>
   </footer>
      <!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
      <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>-->
  </body>
</html>
