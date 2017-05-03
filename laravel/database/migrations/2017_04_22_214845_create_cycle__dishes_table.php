<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCycleDishesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cycle_dishes', function (Blueprint $table) {

            $table->increments('id');
            $table->unsignedInteger('id_cycle');
            $table->unsignedInteger('id_dish');
            $table->dateTime('date_cycle');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('id_cycle')->references('id')->on('cycles');
            $table->foreign('id_dish')->references('id')->on('dishes');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cycle_dishes');
    }
}
