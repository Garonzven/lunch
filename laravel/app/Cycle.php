<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Cycle extends Model
{
	use SoftDeletes;

    protected $table = "cycles";

    protected $dates = ['deleted_at'];

    protected $fillable = ['initial_date', 'closing_date', 'limit_date'];
}
