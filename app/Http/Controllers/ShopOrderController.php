<?php

namespace App\Http\Controllers;

use App\Models\ShopOrder;
use App\Services\ShopService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopOrderController extends Controller
{
    public function __construct(private readonly ShopService $shopService) {}

    public function index(Request $request): Response
    {
        $orders = ShopOrder::with('student')
            ->when($request->search, fn ($q, $s) => $q->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$s}%")))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/shop/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(ShopOrder $shopOrder): Response
    {
        $shopOrder->load('student', 'items.product');

        return Inertia::render('admin/shop/orders/show', [
            'order' => $shopOrder,
        ]);
    }

    public function updateStatus(Request $request, ShopOrder $shopOrder): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,paid,processing,shipped,delivered,cancelled'],
        ]);

        $this->shopService->updateStatus($shopOrder, $validated['status']);

        return back()->with('success', "Order status updated to {$validated['status']}.");
    }
}
