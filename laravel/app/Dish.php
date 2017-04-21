<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Dish extends Model
{
  protected $table = "dishes";

  protected $fillable = ['title', 'description'];
}
