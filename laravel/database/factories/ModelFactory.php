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

    return [
        'name' => 'carlos',
        'jobtitle' => str_random(10),
        'country' => str_random(10),
        'city' => str_random(10),
        'phone' => str_random(7),
        'photo' => str_random(25),
        'email' => "carlosolivero2@gmail.com",
        'password' => bcrypt("12345"),
        'change_pass' => true,
        'id_profile' => 1,

    ];
});


$factory->define(App\Provider::class, function (Faker\Generator $faker) {


    return [
        'name' => 'Subway',
        'address' => '5 Julio con Delicias',
        'phone' => '0426-8569854',
        'cellphone' => str_random(10),
        'country' => str_random(10),
        'city' => str_random(7),
        'email' => $faker->email,
    ];
});

$factory->define(App\Dish::class, function (Faker\Generator $faker) {


    return [
        'title' => $faker->name,
        'description' => str_random(10),
        'id_provider' => 1,
    ];
});

$factory->define(App\Role::class, function (Faker\Generator $faker) {


    return [
        'action' => 'AUW',
        'id_profile' => 1,
    ];
});
