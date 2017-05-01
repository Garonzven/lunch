<?php

use Illuminate\Database\Seeder;
use App\Dish;

class DishSeederTable extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $dish = Dish::create([
        'title' => 'No quiero',
        'description' => 'No quiero',
        'id_provider' => 1,
      ]);
    }
}
