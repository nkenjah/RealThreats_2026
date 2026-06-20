<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $fees = Fee::with(['program', 'fundSource'])
            ->when($request->program_id, fn ($q, $id) => $q->where('program_id', $id))
            ->when($request->academic_year, fn ($q, $y) => $q->where('academic_year', $y))
            ->when($request->fee_type, fn ($q, $t) => $q->where('fee_type', $t))
            ->paginate($request->per_page ?? 15);

        return response()->json($fees);
    }

    public function show(Fee $fee): JsonResponse
    {
        $fee->load(['program', 'fundSource']);

        return response()->json(['data' => $fee]);
    }
}
