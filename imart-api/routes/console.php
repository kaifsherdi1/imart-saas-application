<?php

use Illuminate\Support\Facades\Schedule;

// Suspend stores whose free trial has ended without a paid plan.
// Requires the scheduler: `php artisan schedule:run` every minute (cron).
Schedule::command('imart:check-trials')->daily()->withoutOverlapping();
