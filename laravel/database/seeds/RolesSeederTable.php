<?php

use Illuminate\Database\Seeder;
use App\Role;
class RolesSeederTable extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $arrays = ['AUW','U','UW'];
      $count = 1;
      foreach ($arrays as $array) {
        $role = new Role();
        $role->action = $array;
        $role->id_profile = $count;
        $count++;
        $role->save();
      }
    }
}
