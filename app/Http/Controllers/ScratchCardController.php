<?php

namespace App\Http\Controllers;

use App\Models\ScratchCard;
use App\Services\ScratchCardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScratchCardController extends Controller
{
    public function __construct(private readonly ScratchCardService $service) {}

    public function index(Request $request): Response
    {
        $cards = ScratchCard::with('issuer')
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->search, fn ($q, $s) => $q->where('pin', 'like', "%{$s}%")
                ->orWhere('serial_number', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/finances/scratch-cards/index', [
            'cards' => $cards,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/finances/scratch-cards/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'count' => ['required', 'integer', 'min:1', 'max:1000'],
            'value' => ['required', 'numeric', 'min:1000'],
            'expires_at' => ['nullable', 'date', 'after:today'],
        ]);

        $this->service->generate($validated['count'], $validated['value'], $validated['expires_at']);

        return redirect()->route('admin.finances.scratch-cards.index')
            ->with('success', "{$validated['count']} scratch cards generated successfully.");
    }

    public function show(ScratchCard $scratchCard): Response
    {
        return Inertia::render('admin/finances/scratch-cards/show', [
            'card' => $scratchCard->load('issuer', 'redeemer'),
        ]);
    }

    public function destroy(ScratchCard $scratchCard): RedirectResponse
    {
        $this->service->revoke($scratchCard);

        return redirect()->route('admin.finances.scratch-cards.index')
            ->with('success', 'Scratch card revoked.');
    }
}
