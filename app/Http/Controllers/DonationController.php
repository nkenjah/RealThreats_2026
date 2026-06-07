<?php

namespace App\Http\Controllers;

use App\Models\AlumniProfile;
use App\Models\Donation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DonationController extends Controller
{
    public function index(Request $request): Response
    {
        $donations = Donation::with('alumniProfile.student')
            ->when($request->search, fn ($query, $search) => $query->where('purpose', 'like', "%{$search}%"))
            ->when($request->min_amount, fn ($query, $min) => $query->where('amount', '>=', $min))
            ->when($request->max_amount, fn ($query, $max) => $query->where('amount', '<=', $max))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/alumni/donations/index', [
            'donations' => $donations,
            'filters' => $request->only(['search', 'min_amount', 'max_amount']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/alumni/donations/create', [
            'alumniProfiles' => AlumniProfile::with('student')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'alumni_profile_id' => ['required', 'exists:alumni_profiles,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'donation_date' => ['required', 'date'],
            'purpose' => ['nullable', 'string', 'max:255'],
        ]);

        Donation::create($validated);

        return redirect()->route('admin.alumni.donations.index')->with('success', 'Donation created.');
    }

    public function show(Donation $donation): Response
    {
        return Inertia::render('admin/alumni/donations/show', [
            'donation' => $donation->load('alumniProfile.student'),
        ]);
    }

    public function edit(Donation $donation): Response
    {
        return Inertia::render('admin/alumni/donations/edit', [
            'donation' => $donation,
            'alumniProfiles' => AlumniProfile::with('student')->orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, Donation $donation): RedirectResponse
    {
        $validated = $request->validate([
            'alumni_profile_id' => ['required', 'exists:alumni_profiles,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'donation_date' => ['required', 'date'],
            'purpose' => ['nullable', 'string', 'max:255'],
        ]);

        $donation->update($validated);

        return back()->with('success', 'Donation updated.');
    }

    public function destroy(Donation $donation): RedirectResponse
    {
        $donation->delete();

        return redirect()->route('admin.alumni.donations.index')->with('success', 'Donation deleted.');
    }
}
