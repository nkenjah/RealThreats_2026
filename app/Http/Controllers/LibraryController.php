<?php

namespace App\Http\Controllers;

use App\Models\LibraryBook;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LibraryController extends Controller
{
    public function index(Request $request): Response
    {
        $books = LibraryBook::query()
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('title', 'like', "%{$search}%")->orWhere('author', 'like', "%{$search}%")->orWhere('isbn', 'like', "%{$search}%")))
            ->when($request->category, fn ($query, $category) => $query->where('category', $category))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/library/index', [
            'books' => $books,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/library/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'isbn' => ['required', 'string', 'max:30', 'unique:library_books,isbn'],
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'publisher' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'total_copies' => ['required', 'integer', 'min:0'],
            'available_copies' => ['required', 'integer', 'min:0', 'lte:total_copies'],
            'shelf_location' => ['nullable', 'string', 'max:100'],
        ]);

        LibraryBook::create($validated);

        return redirect()->route('admin.library.index')->with('success', 'Book created.');
    }

    public function show(LibraryBook $libraryBook): Response
    {
        return Inertia::render('admin/library/show', [
            'libraryBook' => $libraryBook->load('libraryBorrowings'),
        ]);
    }

    public function edit(LibraryBook $libraryBook): Response
    {
        return Inertia::render('admin/library/edit', [
            'libraryBook' => $libraryBook,
        ]);
    }

    public function update(Request $request, LibraryBook $libraryBook): RedirectResponse
    {
        $validated = $request->validate([
            'isbn' => ['required', 'string', 'max:30', 'unique:library_books,isbn,'.$libraryBook->id],
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'publisher' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'total_copies' => ['required', 'integer', 'min:0'],
            'available_copies' => ['required', 'integer', 'min:0', 'lte:total_copies'],
            'shelf_location' => ['nullable', 'string', 'max:100'],
        ]);

        $libraryBook->update($validated);

        return back()->with('success', 'Book updated.');
    }

    public function destroy(LibraryBook $libraryBook): RedirectResponse
    {
        $libraryBook->delete();

        return redirect()->route('admin.library.index')->with('success', 'Book deleted.');
    }
}
