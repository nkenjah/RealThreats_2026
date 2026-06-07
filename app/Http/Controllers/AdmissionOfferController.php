<?php

namespace App\Http\Controllers;

use App\Models\AdmissionOffer;
use App\Models\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdmissionOfferController extends Controller
{
    public function index(Request $request): Response
    {
        $admissionOffers = AdmissionOffer::with('application.prospect')
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/admissions/offers/index', [
            'admissionOffers' => $admissionOffers,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/admissions/offers/create', [
            'applications' => Application::with('prospect')->whereDoesntHave('admissionOffer')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'application_id' => ['required', 'exists:applications,id', 'unique:admission_offers,application_id'],
            'offer_date' => ['required', 'date'],
            'decision_deadline' => ['required', 'date'],
            'tuition_fee' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'max:50'],
            'responded_at' => ['nullable', 'date'],
        ]);

        AdmissionOffer::create($validated);

        return redirect()->route('admin.admissions.offers.index')->with('success', 'Admission offer created.');
    }

    public function show(AdmissionOffer $admissionOffer): Response
    {
        return Inertia::render('admin/admissions/offers/show', [
            'admissionOffer' => $admissionOffer->load('application.prospect', 'application.program'),
        ]);
    }

    public function edit(AdmissionOffer $admissionOffer): Response
    {
        return Inertia::render('admin/admissions/offers/edit', [
            'admissionOffer' => $admissionOffer->load('application'),
            'applications' => Application::with('prospect')->orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, AdmissionOffer $admissionOffer): RedirectResponse
    {
        $validated = $request->validate([
            'application_id' => ['required', 'exists:applications,id', 'unique:admission_offers,application_id,'.$admissionOffer->id],
            'offer_date' => ['required', 'date'],
            'decision_deadline' => ['required', 'date'],
            'tuition_fee' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'max:50'],
            'responded_at' => ['nullable', 'date'],
        ]);

        $admissionOffer->update($validated);

        return back()->with('success', 'Admission offer updated.');
    }

    public function destroy(AdmissionOffer $admissionOffer): RedirectResponse
    {
        $admissionOffer->delete();

        return redirect()->route('admin.admissions.offers.index')->with('success', 'Admission offer deleted.');
    }
}
