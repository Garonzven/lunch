<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
	use SoftDeletes;

    protected $table = "orders";

    protected $dates = ['deleted_at'];

  	protected $fillable = ['id_user', 'id_dish', 'date_order', 'observation'];


}
