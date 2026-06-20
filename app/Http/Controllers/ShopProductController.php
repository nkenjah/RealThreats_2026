<?php

namespace App\Http\Controllers;

use App\Models\ShopProduct;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = ShopProduct::when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")
            ->orWhere('sku', 'like', "%{$s}%"))
            ->when($request->category, fn ($q, $c) => $q->where('category', $c))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/shop/products/index', [
            'products' => $products,
            'filters' => $request->only(['search', 'category', 'status']),
            'categories' => ShopProduct::whereNotNull('category')->distinct()->pluck('category'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/shop/products/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'category' => ['nullable', 'string', 'max:100'],
            'sku' => ['nullable', 'string', 'max:50', 'unique:shop_products,sku'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        ShopProduct::create($validated);

        return redirect()->route('admin.shop.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(ShopProduct $shopProduct): Response
    {
        return Inertia::render('admin/shop/products/edit', [
            'product' => $shopProduct,
        ]);
    }

    public function update(Request $request, ShopProduct $shopProduct): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'category' => ['nullable', 'string', 'max:100'],
            'sku' => ['nullable', 'string', 'max:50', 'unique:shop_products,sku,'.$shopProduct->id],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $shopProduct->update($validated);

        return redirect()->route('admin.shop.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(ShopProduct $shopProduct): RedirectResponse
    {
        $shopProduct->delete();

        return redirect()->route('admin.shop.products.index')
            ->with('success', 'Product deleted.');
    }
}
