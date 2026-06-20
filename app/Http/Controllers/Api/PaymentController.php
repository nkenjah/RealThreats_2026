<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $payments = Payment::with(['student', 'fee'])
            ->when($request->student_id, fn ($q, $id) => $q->where('student_id', $id))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->date_from, fn ($q, $d) => $q->whereDate('payment_date', '>=', $d))
            ->when($request->date_to, fn ($q, $d) => $q->whereDate('payment_date', '<=', $d))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json($payments);
    }

    public function show(Payment $payment): JsonResponse
    {
        $payment->load(['student', 'fee', 'financialAccount']);

        return response()->json(['data' => $payment]);
    }
}
