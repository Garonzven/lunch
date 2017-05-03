<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
	use SoftDeletes;

    protected $table = "providers";

    protected $dates = ['deleted_at'];

    protected $fillable = ['name', 'address', 'phone', 'cellphone', 'country', 'city', 'email'];
}
