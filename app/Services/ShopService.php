<?php

namespace App\Services;

use App\Models\ShopOrder;
use App\Models\ShopProduct;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class ShopService
{
    public function __construct(private readonly WalletService $walletService) {}

    public function placeOrder(Student $student, array $items, ?string $notes = null): ShopOrder
    {
        return DB::transaction(function () use ($student, $items, $notes) {
            $orderItems = [];
            $total = 0;

            foreach ($items as $item) {
                $product = ShopProduct::findOrFail($item['product_id']);

                if (! $product->inStock()) {
                    throw new \RuntimeException("{$product->name} is out of stock.");
                }

                $quantity = min($item['quantity'], $product->stock_quantity);
                $subtotal = $product->price * $quantity;

                $orderItems[] = [
                    'shop_product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                ];

                $total += $subtotal;

                $product->decrement('stock_quantity', $quantity);
            }

            $order = ShopOrder::create([
                'student_id' => $student->id,
                'total_amount' => $total,
                'status' => 'pending',
                'notes' => $notes,
            ]);

            $order->items()->createMany($orderItems);

            return $order;
        });
    }

    public function processPayment(ShopOrder $order): ShopOrder
    {
        return DB::transaction(function () use ($order) {
            $student = $order->student;
            $wallet = $this->walletService->getOrCreateWallet($student);

            $transaction = $this->walletService->pay(
                $wallet,
                $order->total_amount,
                'shop_order',
                $order->id,
                "Payment for order #{$order->id}"
            );

            if (! $transaction) {
                throw new \RuntimeException('Insufficient wallet balance.');
            }

            $order->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            return $order->fresh();
        });
    }

    public function updateStatus(ShopOrder $order, string $status): ShopOrder
    {
        $order->update(['status' => $status]);

        if ($status === 'cancelled') {
            $this->restockItems($order);
        }

        return $order->fresh();
    }

    private function restockItems(ShopOrder $order): void
    {
        foreach ($order->items as $item) {
            $item->product->increment('stock_quantity', $item->quantity);
        }
    }
}
