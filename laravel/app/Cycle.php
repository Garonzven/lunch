<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cycle_dishes extends Model
{
    protected $table = "cycles";

    protected $fillable = ['days', 'initial_date', 'remark'];
}
