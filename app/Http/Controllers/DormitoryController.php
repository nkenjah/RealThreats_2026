<?php

namespace App\Http\Controllers;

use App\Models\Dormitory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DormitoryController extends Controller
{
    public function index(Request $request): Response
    {
        $dormitories = Dormitory::query()
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%")))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/housing/dormitories/index', [
            'dormitories' => $dormitories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/housing/dormitories/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:30', 'unique:dormitories,code'],
            'capacity' => ['required', 'integer', 'min:1'],
            'gender' => ['nullable', 'string', 'max:20'],
            'description' => ['nullable', 'string'],
        ]);

        Dormitory::create($validated);

        return redirect()->route('admin.housing.dormitories.index')->with('success', 'Dormitory created.');
    }

    public function show(Dormitory $dormitory): Response
    {
        return Inertia::render('admin/housing/dormitories/show', [
            'dormitory' => $dormitory->load('hostels'),
        ]);
    }

    public function edit(Dormitory $dormitory): Response
    {
        return Inertia::render('admin/housing/dormitories/edit', [
            'dormitory' => $dormitory,
        ]);
    }

    public function update(Request $request, Dormitory $dormitory): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:30', 'unique:dormitories,code,'.$dormitory->id],
            'capacity' => ['required', 'integer', 'min:1'],
            'gender' => ['nullable', 'string', 'max:20'],
            'description' => ['nullable', 'string'],
        ]);

        $dormitory->update($validated);

        return back()->with('success', 'Dormitory updated.');
    }

    public function destroy(Dormitory $dormitory): RedirectResponse
    {
        $dormitory->delete();

        return redirect()->route('admin.housing.dormitories.index')->with('success', 'Dormitory deleted.');
    }
}
