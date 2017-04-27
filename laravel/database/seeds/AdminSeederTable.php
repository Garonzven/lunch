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
      $arrays = ['admin','user','watcher'];
      $count = 1;
    foreach($arrays as $key)
    {


      $user = User::create([
        'name' => 'Admin',
        'jobtitle' => 'El papa de los helados',
        'country' => 'Narnia',
        'city' => 'Ningun lugar',
        'phone' => '0416-5698563',
        'email' => $key.'@gmail.com',
        'photo' => 'fuyctydtyluififiyfufkctdtydjdyj',
        'password' => bcrypt('12345'),
        'change_pass' => true,
        'id_profile' => $count,
      ]);
      $count++;
      }

    }
}
