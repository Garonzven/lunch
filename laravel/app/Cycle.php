<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Cycle extends Model
{
	use SoftDeletes;

    protected $table = "cycles";

    protected $dates = ['deleted_at'];

    protected $fillable = ['closing_date', 'initial_date', 'remark'];
}
