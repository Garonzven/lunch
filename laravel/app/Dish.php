<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Dish extends Model
{
	use SoftDeletes;

    protected $table = "dishes";

    protected $dates = ['deleted_at'];

  	protected $fillable = ['title', 'description', 'id_provider'];

  	public function scopeName($query, $title)
    {

    	$query->where('title', 'LIKE', "%$title%");
    }
}
