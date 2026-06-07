<?php

namespace App\Http\Controllers;

use App\Models\FundSource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FundSourceController extends Controller
{
    public function index(Request $request): Response
    {
        $fundSources = FundSource::query()
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when($request->is_active !== null && $request->is_active !== '', fn ($query) => $query->where('is_active', request()->boolean('is_active')))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/finances/fund-sources/index', [
            'fundSources' => $fundSources,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/finances/fund-sources/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'total_fund' => ['required', 'numeric', 'min:0'],
            'remaining_balance' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        FundSource::create($validated);

        return redirect()->route('admin.finances.fund-sources.index')->with('success', 'Fund source created.');
    }

    public function show(FundSource $fundSource): Response
    {
        return Inertia::render('admin/finances/fund-sources/show', [
            'fundSource' => $fundSource->load('scholarshipAwards'),
        ]);
    }

    public function edit(FundSource $fundSource): Response
    {
        return Inertia::render('admin/finances/fund-sources/edit', [
            'fundSource' => $fundSource,
        ]);
    }

    public function update(Request $request, FundSource $fundSource): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'total_fund' => ['required', 'numeric', 'min:0'],
            'remaining_balance' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $fundSource->update($validated);

        return back()->with('success', 'Fund source updated.');
    }

    public function destroy(FundSource $fundSource): RedirectResponse
    {
        $fundSource->delete();

        return redirect()->route('admin.finances.fund-sources.index')->with('success', 'Fund source deleted.');
    }
}
