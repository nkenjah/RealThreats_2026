<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomInventory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomInventoryController extends Controller
{
    public function index(Request $request): Response
    {
        $roomInventories = RoomInventory::with('room')
            ->when($request->search, fn ($query, $search) => $query->where('item_name', 'like', "%{$search}%"))
            ->when($request->room_id, fn ($query, $roomId) => $query->where('room_id', $roomId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/facilities/inventory/index', [
            'roomInventories' => $roomInventories,
            'filters' => $request->only(['search', 'room_id']),
            'rooms' => Room::orderBy('room_number')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/facilities/inventory/create', [
            'rooms' => Room::orderBy('room_number')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'room_id' => ['required', 'exists:rooms,id'],
            'item_name' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:0'],
            'condition' => ['nullable', 'string', 'max:100'],
        ]);

        RoomInventory::create($validated);

        return redirect()->route('admin.facilities.inventory.index')->with('success', 'Room inventory item created.');
    }

    public function show(RoomInventory $roomInventory): Response
    {
        return Inertia::render('admin/facilities/inventory/show', [
            'roomInventory' => $roomInventory->load('room'),
        ]);
    }

    public function edit(RoomInventory $roomInventory): Response
    {
        return Inertia::render('admin/facilities/inventory/edit', [
            'roomInventory' => $roomInventory,
            'rooms' => Room::orderBy('room_number')->get(),
        ]);
    }

    public function update(Request $request, RoomInventory $roomInventory): RedirectResponse
    {
        $validated = $request->validate([
            'room_id' => ['required', 'exists:rooms,id'],
            'item_name' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:0'],
            'condition' => ['nullable', 'string', 'max:100'],
        ]);

        $roomInventory->update($validated);

        return back()->with('success', 'Room inventory item updated.');
    }

    public function destroy(RoomInventory $roomInventory): RedirectResponse
    {
        $roomInventory->delete();

        return redirect()->route('admin.facilities.inventory.index')->with('success', 'Room inventory item deleted.');
    }
}
