<?php

namespace App\Http\Controllers;

use App\Models\Dormitory;
use App\Models\Hostel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HostelController extends Controller
{
    public function index(Request $request): Response
    {
        $hostels = Hostel::with('dormitory')
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when($request->dormitory_id, fn ($query, $dormitoryId) => $query->where('dormitory_id', $dormitoryId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/housing/hostels/index', [
            'hostels' => $hostels,
            'filters' => $request->only(['search', 'dormitory_id']),
            'dormitories' => Dormitory::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/housing/hostels/create', [
            'dormitories' => Dormitory::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'dormitory_id' => ['required', 'exists:dormitories,id'],
            'capacity' => ['required', 'integer', 'min:1'],
        ]);

        Hostel::create($validated);

        return redirect()->route('admin.housing.hostels.index')->with('success', 'Hostel created.');
    }

    public function show(Hostel $hostel): Response
    {
        return Inertia::render('admin/housing/hostels/show', [
            'hostel' => $hostel->load('dormitory', 'hostelAllocations'),
        ]);
    }

    public function edit(Hostel $hostel): Response
    {
        return Inertia::render('admin/housing/hostels/edit', [
            'hostel' => $hostel,
            'dormitories' => Dormitory::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Hostel $hostel): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'dormitory_id' => ['required', 'exists:dormitories,id'],
            'capacity' => ['required', 'integer', 'min:1'],
        ]);

        $hostel->update($validated);

        return back()->with('success', 'Hostel updated.');
    }

    public function destroy(Hostel $hostel): RedirectResponse
    {
        $hostel->delete();

        return redirect()->route('admin.housing.hostels.index')->with('success', 'Hostel deleted.');
    }
}
