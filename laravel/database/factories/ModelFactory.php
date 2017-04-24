<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\User::class, function (Faker\Generator $faker) {
    static $bool = true;
    static $val = 1;

    return [
        'name' => $faker->name,
        'last_name' => $faker->name,
        'dni' => str_random(rand(5,15)),
        'country' => str_random(10),
        'city' => str_random(10),
        'phone' => str_random(7),
        'photo' => str_random(25),
        'email' => $faker->email,
        'password' => bcrypt(str_random(4)),
        'change_pass' => $bool,
        'id_profile' => $val,

    ];
});
