<?php

namespace App\Http\Controllers;

use App\Models\FacultyStaff;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Services\LeaveService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    public function __construct(private readonly LeaveService $leaveService) {}

    public function index(Request $request): Response
    {
        $requests = LeaveRequest::with(['facultyStaff.user', 'approver'])
            ->when($request->search, fn ($q, $s) => $q->whereHas('facultyStaff.user', fn ($q) => $q->where('name', 'like', "%{$s}%")))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->type, fn ($q, $t) => $q->where('type', $t))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/payroll/leave-requests/index', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/payroll/leave-requests/create', [
            'staff' => FacultyStaff::with('user')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'faculty_staff_id' => ['required', 'exists:faculty_staff,id'],
            'type' => ['required', 'in:annual,sick,study,compassionate,other'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $staff = FacultyStaff::findOrFail($validated['faculty_staff_id']);
        $start = Carbon::parse($validated['start_date']);
        $end = Carbon::parse($validated['end_date']);
        $days = $start->diffInDays($end) + 1;

        $this->leaveService->requestLeave(
            $staff,
            $validated['type'],
            $validated['start_date'],
            $validated['end_date'],
            $days,
            $validated['reason'],
        );

        return redirect()->route('admin.payroll.leave-requests.index')
            ->with('success', 'Leave request submitted.');
    }

    public function updateStatus(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:approve,reject'],
            'rejection_reason' => ['required_if:action,reject', 'string', 'max:1000'],
        ]);

        if ($validated['action'] === 'approve') {
            $this->leaveService->approve($leaveRequest);
            $message = 'Leave request approved.';
        } else {
            $this->leaveService->reject($leaveRequest, $validated['rejection_reason'] ?? 'No reason provided.');
            $message = 'Leave request rejected.';
        }

        return back()->with('success', $message);
    }

    public function balances(Request $request): Response
    {
        $balances = LeaveBalance::with('facultyStaff.user')
            ->when($request->year, fn ($q, $y) => $q->where('year', $y))
            ->latest('year')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/payroll/leave-requests/balances', [
            'balances' => $balances,
            'filters' => $request->only(['year']),
            'currentYear' => now()->year,
        ]);
    }
}
