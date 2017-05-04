<?php

use Illuminate\Database\Seeder;
use App\User;

class AdminSeederTable extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $arrays = ['carlosolivero2','jeremyfys25','jeremyfys26'];
      $count = 1;
    foreach($arrays as $key)
    {


      $user = User::create([
        'name' => $key,
        'jobtitle' => 'El papa de los helados',
        'country' => 'Narnia',
        'city' => 'Ningun lugar',
        'phone' => '0416-5698563',
        'email' => $key.'@gmail.com',
        'photo' => 'fuyctydtyluififiyfufkctdtydjdyj',
        'password' => bcrypt('12345'),
        'change_pass' => false,
        'id_profile' => $count,
      ]);
      $count++;
      }

    }
}
