<?php

use App\Jobs\GenerateDailySecurityReportJob;
use App\Jobs\RecalculateRiskScoresJob;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new RecalculateRiskScoresJob)->everyFifteenMinutes();
Schedule::job(new GenerateDailySecurityReportJob)->dailyAt('07:00')->timezone('Africa/Dar_es_Salaam');

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
