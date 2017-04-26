<?php

use Illuminate\Database\Seeder;
use App\Setting;
class SettingSeederTable extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $setting = new Setting();
      $setting->remark = false;
      $setting->save();
    }
}
