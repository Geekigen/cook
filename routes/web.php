<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('recipes',RecipeController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
