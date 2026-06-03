<?php

namespace App\Http\Controllers;

use App\Events\ThreatMitigatedEvent;
use App\Models\ThreatAlert;
use App\Services\ReportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ThreatAlertController extends Controller
{
    public function index(Request $request): Response
    {
        $alerts = ThreatAlert::with(['user.department'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('user', fn ($userQuery) => $userQuery->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")))
            ->when($request->severity, fn ($query, $severity) => $query->where('severity', $severity))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->alert_type, fn ($query, $type) => $query->where('alert_type', $type))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/threat-alerts/index', [
            'alerts' => $alerts,
            'filters' => $request->only(['search', 'severity', 'status', 'alert_type']),
        ]);
    }

    public function show(ThreatAlert $threatAlert, ReportService $reportService): Response
    {
        $threatAlert->load(['user.department', 'activityLog', 'resolver']);

        return Inertia::render('admin/threat-alerts/show', [
            'alert' => $threatAlert,
            'timeline' => $reportService->getUserActivityTimeline($threatAlert->user),
        ]);
    }

    public function update(Request $request, ThreatAlert $threatAlert): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:open,investigating,resolved,false_positive'],
            'notes' => ['nullable', 'string'],
        ]);

        $threatAlert->update([
            ...$validated,
            'resolved_by' => in_array($validated['status'], ['resolved', 'false_positive'], true) ? $request->user()->id : null,
            'resolved_at' => in_array($validated['status'], ['resolved', 'false_positive'], true) ? now() : null,
            'mitigation_action' => $validated['status'] === 'resolved' ? 'manual_review_resolved' : $threatAlert->mitigation_action,
        ]);

        broadcast(new ThreatMitigatedEvent($threatAlert));

        return back()->with('success', 'Threat alert updated.');
    }

    public function destroy(ThreatAlert $threatAlert): RedirectResponse
    {
        $threatAlert->delete();

        return redirect()->route('admin.threat-alerts.index')->with('success', 'Threat alert deleted.');
    }
}
