<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function index(Request $request): Response
    {
        $rooms = Room::with('building')
            ->when($request->search, fn ($query, $search) => $query->where('room_number', 'like', "%{$search}%"))
            ->when($request->building_id, fn ($query, $buildingId) => $query->where('building_id', $buildingId))
            ->when($request->room_type, fn ($query, $type) => $query->where('room_type', $type))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/facilities/rooms/index', [
            'rooms' => $rooms,
            'filters' => $request->only(['search', 'building_id', 'room_type']),
            'buildings' => Building::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/facilities/rooms/create', [
            'buildings' => Building::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'building_id' => ['required', 'exists:buildings,id'],
            'room_number' => ['required', 'string', 'max:30', 'unique:rooms,room_number'],
            'room_type' => ['required', 'string', 'max:50'],
            'capacity' => ['required', 'integer', 'min:1'],
            'is_lab' => ['boolean'],
        ]);

        Room::create($validated);

        return redirect()->route('admin.facilities.rooms.index')->with('success', 'Room created.');
    }

    public function show(Room $room): Response
    {
        return Inertia::render('admin/facilities/rooms/show', [
            'room' => $room->load('building', 'roomInventory'),
        ]);
    }

    public function edit(Room $room): Response
    {
        return Inertia::render('admin/facilities/rooms/edit', [
            'room' => $room,
            'buildings' => Building::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Room $room): RedirectResponse
    {
        $validated = $request->validate([
            'building_id' => ['required', 'exists:buildings,id'],
            'room_number' => ['required', 'string', 'max:30', 'unique:rooms,room_number,'.$room->id],
            'room_type' => ['required', 'string', 'max:50'],
            'capacity' => ['required', 'integer', 'min:1'],
            'is_lab' => ['boolean'],
        ]);

        $room->update($validated);

        return back()->with('success', 'Room updated.');
    }

    public function destroy(Room $room): RedirectResponse
    {
        $room->delete();

        return redirect()->route('admin.facilities.rooms.index')->with('success', 'Room deleted.');
    }
}
