<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" media="screen" href="/css/main.css">-->
    <title>Welcome user</title>
  </head>
  <body>
    <nav style="top: 0;border-width: 0 0 1px;background-color: #f5f5f5 !important;height: 70px;">
     <div style="padding-right: 15px;padding-left: 15px;margin-right: auto;margin-left: auto;">
   <!-- Brand and toggle get grouped for better mobile display -->
       <div style="margin-right: 0;margin-left: 0;">
         <a style="float: left;height: 50px;padding: 15px 15px;font-size: 18px;line-height: 20px;padding-top: 0;display: none;position: absolute !important;left: calc(10% - 70px) !important;display: block;bottom: 18px;"href="#">
           <img style="position: relative;height: 80px;width: 130px;bottom: 575px;left: 10px;" src="http://13.92.198.201/laravel/public/images/logo_horizontal_dark.png" alt="Logo">
         </a>
       </div>
     </div>
   </nav>
   <div style="padding-right: 15px; padding-left: 15px;margin-right: auto; margin-left: auto;">
     <div style="margin-right: -15px;margin-left: -15px;">
       <div style="padding-top:65px; text-align: center;">
         <img style="width: 200px;height: 150px;" src="http://13.92.198.201/laravel/public/images/welcome_dishd.png" alt="logo">
         <br>
         <br>
         <h1><b>WELCOME</b></h1>
         <h3>Hi!, nice to meet you</h3>
         <h3>Welcome to lunch time, here you can be able to choose your</h3>
         <h3>dishes for your entire menu offered by us</h3>
         <h3>Here is your user name:</h3>
         <h3 style="color:#d32f2f;">{{$data->email}}</h3>
       </div>
       <h3 style="text-align: center;">And this your provisional password:</h3>
         <div style="border: 1px solid #9e9e9e;width: 373px;margin-left:93px; text-align: center;">
           <!--passwor aqui-->
           <h3><b>{{$password}}</b></h3>
         </div>
         <br>
           <a style="display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 18px;
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
    border-radius: 4px;background-color:#d32f2f;width: 240px;color: #ffffff; border-radius:0px; height:30px; text-decoration: none; margin-left:148px;"  href="http://13.92.198.201/login.html"><b style="position: relative; top:5px; font-size: 17px;" >Check menu</b></a>
         <h4 style="text-align:center !important;">Click on the button to check new dishes.</h4>

       <br>
       <p style="font-size:25px; margin-bottom:-30px !important;"><b>Bon Appetite!</b></p>
       <p style="font-size:25px;"><b>The Lunch Time Team</b></p>
     </div>
   </div>
   <br>
   <footer style="background-color: #d32f2f;height: 44px;">
     <div style="padding-right: 15px;padding-left: 15px;margin-right: auto;margin-left: auto;">
       <h3 style="text-align: center; color:#ffffff; padding-top:10px;">Lunch Time - Garonz 2017</h3>
     </div>
   </footer>
      <!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
      <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>-->
  </body>
</html>
