<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    protected $table = "providers";

    protected $fillable = ['name', 'address', 'phone', 'cellphone', 'country', 'city', 'email'];
}
