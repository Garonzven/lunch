<?php

use Illuminate\Database\Seeder;
use App\Profile;
class ProfileSeederTable extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arrays = ['Admin','User','Watcher'];
        foreach ($arrays as $array) {
        	$profile = new Profile();
        	$profile->profile_type = $array;
        	$profile->save();
        }
    }
}
