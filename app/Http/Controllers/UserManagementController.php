<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use App\Services\ReportService;
use App\Services\SessionTrackerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::with(['department', 'roles', 'riskScore'])
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")))
            ->when($request->role, fn ($query, $role) => $query->role($role))
            ->when($request->department_id, fn ($query, $departmentId) => $query->where('department_id', $departmentId))
            ->when($request->locked !== null && $request->locked !== '', fn ($query) => $query->where('is_locked', request()->boolean('locked')))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'department_id', 'locked']),
            'departments' => Department::orderBy('name')->get(),
            'roles' => Role::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'departments' => Department::orderBy('name')->get(),
            'roles' => Role::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->merge(['department_id' => $request->department_id === '0' ? null : $request->department_id]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'role' => ['required', 'exists:roles,name'],
        ]);

        $user = User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'is_active' => true,
        ]);
        $user->assignRole($validated['role']);

        return redirect()->route('admin.users.index')->with('success', 'User created.');
    }

    public function show(User $user, ReportService $reportService): Response
    {
        return Inertia::render('admin/users/show', [
            'user' => $user->load(['department', 'roles', 'riskScore', 'sessionTracker' => fn ($query) => $query->latest('login_at')->take(20)]),
            'activity' => $reportService->getUserActivityTimeline($user),
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'user' => $user->load(['department', 'roles']),
            'departments' => Department::orderBy('name')->get(),
            'roles' => Role::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $request->merge(['department_id' => $request->department_id === '0' ? null : $request->department_id]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,'.$user->id],
            'department_id' => ['nullable', 'exists:departments,id'],
            'role' => ['required', 'exists:roles,name'],
            'is_active' => ['boolean'],
        ]);

        $user->update($validated);
        $user->syncRoles([$validated['role']]);

        return back()->with('success', 'User updated.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted.');
    }

    public function lockAccount(User $user): RedirectResponse
    {
        $user->triggerKillSwitch('Manually locked by administrator.');

        return back()->with('success', 'Account locked.');
    }

    public function unlockAccount(User $user): RedirectResponse
    {
        $user->update(['is_locked' => false, 'locked_at' => null, 'lock_reason' => null, 'failed_login_count' => 0]);

        return back()->with('success', 'Account unlocked.');
    }

    public function forceLogout(User $user, SessionTrackerService $sessionTracker): RedirectResponse
    {
        $sessionTracker->terminateAllSessions($user, 'Manual force logout by administrator.');

        return back()->with('success', 'Active sessions terminated.');
    }

    public function getRiskProfile(User $user)
    {
        return response()->json($user->load(['riskScore', 'activityLogs' => fn ($query) => $query->latest()->take(20)]));
    }
}
