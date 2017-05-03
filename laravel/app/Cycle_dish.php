<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Cycle_Dish extends Model
{
	use SoftDeletes;

    protected $table = "cycle_dishes";

    protected $dates = ['deleted_at'];

  	protected $fillable = ['id_cycle', 'id_dish', 'date_cycle'];
}
