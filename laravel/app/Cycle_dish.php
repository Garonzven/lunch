<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cycle_Dish extends Model
{
     protected $table = "cycle_dishes";

  	 protected $fillable = ['id_cycle', 'id_dishes'];
}
