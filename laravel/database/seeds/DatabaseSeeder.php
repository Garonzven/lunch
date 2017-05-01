<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ProfileSeederTable::class);
        $this->call(RolesSeederTable::class);
        $this->call(AdminSeederTable::class);
        $this->call(SettingSeederTable::class);
        $this->call(ProviderSeederTable::class);
        $this->call(DishSeederTable::class);
    }
}
