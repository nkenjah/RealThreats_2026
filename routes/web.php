<?php

use App\Http\Controllers\AcademicTranscriptController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AdmissionOfferController;
use App\Http\Controllers\AlumniProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ApplicationRequirementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\CampusController;
use App\Http\Controllers\CareerPlacementController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseOfferingController;
use App\Http\Controllers\CoursePrerequisiteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DegreeAuditController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\DormitoryController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\FacultyStaffController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\FinalTermGradeController;
use App\Http\Controllers\FinancialAccountController;
use App\Http\Controllers\FundSourceController;
use App\Http\Controllers\GradebookComponentController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\GraduationApplicationController;
use App\Http\Controllers\HostelController;
use App\Http\Controllers\LectureController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\LibraryFineController;
use App\Http\Controllers\LmsCourseController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProgramRequirementController;
use App\Http\Controllers\ProspectController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleManagementController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomInventoryController;
use App\Http\Controllers\ScholarshipAwardController;
use App\Http\Controllers\SessionLogController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentRegistrationController;
use App\Http\Controllers\StudentStatusLogController;
use App\Http\Controllers\SystemConfigController;
use App\Http\Controllers\ThreatAlertController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\WaitlistController;
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

        // Academic
        Route::resource('programs', ProgramController::class);
        Route::resource('offerings', CourseOfferingController::class);
        Route::resource('enrollments', EnrollmentController::class);
        Route::resource('gradebook-components', GradebookComponentController::class);
        Route::resource('grades', GradeController::class);
        Route::resource('final-term-grades', FinalTermGradeController::class);

        // Timetables
        Route::resource('timetables', TimetableController::class);

        // Faculty
        Route::resource('faculty', FacultyStaffController::class);

        // Admissions
        Route::resource('admissions.prospects', ProspectController::class);
        Route::resource('admissions.applications', ApplicationController::class);
        Route::resource('admissions.offers', AdmissionOfferController::class);
        Route::resource('admissions.application-requirements', ApplicationRequirementController::class);

        // Finance
        Route::resource('fees', FeeController::class);
        Route::resource('financial-accounts', FinancialAccountController::class);
        Route::resource('payments', PaymentController::class);
        Route::resource('scholarship-awards', ScholarshipAwardController::class);
        Route::resource('fund-sources', FundSourceController::class);

        // Library
        Route::resource('library', LibraryController::class);
        Route::resource('library-fines', LibraryFineController::class);

        // LMS
        Route::resource('lms-courses', LmsCourseController::class);

        // Housing
        Route::resource('dormitories', DormitoryController::class);
        Route::resource('hostels', HostelController::class);

        // Alumni
        Route::resource('alumni', AlumniProfileController::class);
        Route::resource('career-placements', CareerPlacementController::class);
        Route::resource('donations', DonationController::class);

        // Campus
        Route::resource('campuses', CampusController::class);
        Route::resource('buildings', BuildingController::class);
        Route::resource('rooms', RoomController::class);
        Route::resource('room-inventory', RoomInventoryController::class);

        // Academic
        Route::resource('academics.transcripts', AcademicTranscriptController::class);
        Route::resource('academics.degree-audits', DegreeAuditController::class);
        Route::resource('academics.graduation-applications', GraduationApplicationController::class);

        // Curriculum
        Route::resource('curriculum.program-requirements', ProgramRequirementController::class);
        Route::resource('curriculum.course-prerequisites', CoursePrerequisiteController::class);

        // Attendance
        Route::resource('attendance', AttendanceController::class);

        // Student info
        Route::resource('student-registrations', StudentRegistrationController::class);
        Route::resource('student-status-logs', StudentStatusLogController::class);
        Route::resource('waitlists', WaitlistController::class);

        // Session logs
        Route::resource('session-logs', SessionLogController::class)->only(['index', 'show']);
    });

require __DIR__.'/settings.php';
