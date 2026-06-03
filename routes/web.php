<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\LectureController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleManagementController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SystemConfigController;
use App\Http\Controllers\ThreatAlertController;
use App\Http\Controllers\UserManagementController;
use App\Models\User;
use App\Notifications\UnlockRequestNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::get('/account-locked', fn () => Inertia::render('auth/account-locked', [
    'reason' => session('lock_reason', 'Your account has been suspended.'),
]))->name('account.locked');

Route::post('/account-unlock-request', function (Request $request) {
    Notification::send(
        User::role(['admin', 'superadmin'])->get(),
        new UnlockRequestNotification($request->input('email'), $request->input('reason'))
    );

    return back()->with('success', 'Unlock request sent to ICT administrators.');
})->name('account.unlock-request');

Route::middleware(['auth', 'verified', 'check.lock', 'track.activity'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('risk-warning', function (Request $request) {
        $user = $request->user();
        if (! $user) {
            return response()->json(['warning' => false]);
        }

        return response()->json([
            'warning' => $user->isHighRisk(),
            'score' => $user->riskScore?->current_score ?? 0,
            'reason' => $user->is_locked ? ($user->lock_reason ?? 'High risk score detected') : null,
        ]);
    })->name('risk.warning');
});

Route::middleware(['auth', 'verified', 'check.lock', 'track.activity', 'role:admin|superadmin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('users', UserManagementController::class);
        Route::post('users/{user}/lock', [UserManagementController::class, 'lockAccount'])->name('users.lock');
        Route::post('users/{user}/unlock', [UserManagementController::class, 'unlockAccount'])->name('users.unlock');
        Route::post('users/{user}/force-logout', [UserManagementController::class, 'forceLogout'])->name('users.force-logout');
        Route::get('users/{user}/risk-profile', [UserManagementController::class, 'getRiskProfile'])->name('users.risk-profile');

        Route::resource('threat-alerts', ThreatAlertController::class)->except(['create', 'store']);
        Route::resource('activity-logs', ActivityLogController::class)->only(['index', 'show']);

        Route::get('system-config', [SystemConfigController::class, 'index'])->name('system-config.index');
        Route::patch('system-config/{config}', [SystemConfigController::class, 'update'])->name('system-config.update');

        Route::get('reports', [ReportController::class, 'dashboard'])->name('reports.dashboard');
        Route::get('reports/user/{user}/timeline', [ReportController::class, 'userTimeline'])->name('reports.user-timeline');
        Route::get('reports/export', [ReportController::class, 'exportCsv'])->name('reports.export');

        Route::get('roles', [RoleManagementController::class, 'index'])->name('roles.index');
        Route::patch('roles/{role}', [RoleManagementController::class, 'update'])->name('roles.update');

        Route::resource('courses', CourseController::class);
        Route::resource('lectures', LectureController::class);
        Route::resource('exams', ExamController::class);
        Route::post('exams/{exam}/toggle-lock', [ExamController::class, 'toggleLock'])->name('exams.toggle-lock');
        Route::resource('students', StudentController::class);
    });

require __DIR__.'/settings.php';
