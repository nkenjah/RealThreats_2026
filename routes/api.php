<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\FeeController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\PredictiveAnalyticsController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('dashboard', [DashboardController::class, 'index']);

    Route::apiResource('students', StudentController::class);
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('exams', ExamController::class);
    Route::apiResource('grades', GradeController::class)->only(['index', 'show']);
    Route::apiResource('fees', FeeController::class)->only(['index', 'show']);
    Route::apiResource('payments', PaymentController::class)->only(['index', 'show']);

    Route::get('analytics/at-risk-students', [PredictiveAnalyticsController::class, 'atRiskStudents']);
    Route::get('analytics/predict-grade', [PredictiveAnalyticsController::class, 'predictGrade']);
    Route::get('analytics/enrollment-trends', [PredictiveAnalyticsController::class, 'enrollmentTrends']);

    Route::post('change-password', [AuthController::class, 'changePassword']);
});
