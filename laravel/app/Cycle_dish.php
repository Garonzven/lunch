<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cycle_dish extends Model
{
  protected $table = "cycle_dishes";

  protected $fillable = ['id_people', 'id_dishes'];
  
}
