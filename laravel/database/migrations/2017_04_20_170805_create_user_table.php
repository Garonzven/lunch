<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 30);
            $table->string('last_name', 30);
            $table->string('dni', 20)->unique();
            $table->string('country', 50);
            $table->string('city', 50);
            $table->string('phone', 15);
            $table->string('email', 50)->unique();
            $table->string('photo', 255);
            $table->string('password', 255);
            $table->boolean('change_pass');
            $table->unsignedInteger('id_profile');
            $table->rememberToken();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('id_profile')->references('id')->on('profiles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
