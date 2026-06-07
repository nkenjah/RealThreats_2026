<?php

namespace App\Http\Controllers;

use App\Models\LibraryBorrowing;
use App\Models\LibraryFine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LibraryFineController extends Controller
{
    public function index(Request $request): Response
    {
        $libraryFines = LibraryFine::with('libraryBorrowing')
            ->when($request->search, fn ($query, $search) => $query->whereHas('libraryBorrowing', fn ($q) => $q->where('id', 'like', "%{$search}%")))
            ->when($request->paid !== null && $request->paid !== '', fn ($query) => $query->where('paid', request()->boolean('paid')))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/library/fines/index', [
            'libraryFines' => $libraryFines,
            'filters' => $request->only(['search', 'paid']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/library/fines/create', [
            'libraryBorrowings' => LibraryBorrowing::orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'library_borrowing_id' => ['required', 'exists:library_borrowings,id', 'unique:library_fines,library_borrowing_id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'paid' => ['boolean'],
            'paid_at' => ['nullable', 'date'],
        ]);

        LibraryFine::create($validated);

        return redirect()->route('admin.library.fines.index')->with('success', 'Library fine created.');
    }

    public function show(LibraryFine $libraryFine): Response
    {
        return Inertia::render('admin/library/fines/show', [
            'libraryFine' => $libraryFine->load('libraryBorrowing'),
        ]);
    }

    public function edit(LibraryFine $libraryFine): Response
    {
        return Inertia::render('admin/library/fines/edit', [
            'libraryFine' => $libraryFine,
            'libraryBorrowings' => LibraryBorrowing::orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, LibraryFine $libraryFine): RedirectResponse
    {
        $validated = $request->validate([
            'library_borrowing_id' => ['required', 'exists:library_borrowings,id', 'unique:library_fines,library_borrowing_id,'.$libraryFine->id],
            'amount' => ['required', 'numeric', 'min:0'],
            'paid' => ['boolean'],
            'paid_at' => ['nullable', 'date'],
        ]);

        $libraryFine->update($validated);

        return back()->with('success', 'Library fine updated.');
    }

    public function destroy(LibraryFine $libraryFine): RedirectResponse
    {
        $libraryFine->delete();

        return redirect()->route('admin.library.fines.index')->with('success', 'Library fine deleted.');
    }
}
