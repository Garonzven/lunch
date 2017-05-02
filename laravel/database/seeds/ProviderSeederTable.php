<?php

use Illuminate\Database\Seeder;
use App\Provider;

class ProviderSeederTable extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $provider = Provider::create(['name' => 'Provider 1',
      'address' => '5 Julio con Delicias',
      'phone' => '0426-8569854',
      'cellphone' => str_random(10),
      'country' => str_random(10),
      'city' => str_random(7),
      'email' => 'provider@gmail.com',
    ]);
    }
}
