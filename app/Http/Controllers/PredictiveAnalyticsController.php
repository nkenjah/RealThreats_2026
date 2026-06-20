<?php

namespace App\Http\Controllers;

use App\Services\PredictiveAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PredictiveAnalyticsController extends Controller
{
    public function __construct(
        private readonly PredictiveAnalyticsService $analytics,
    ) {}

    public function atRiskStudents(Request $request): JsonResponse
    {
        $limit = $request->integer('limit', 10);

        return response()->json([
            'data' => $this->analytics->atRiskStudents($limit),
        ]);
    }

    public function predictGrade(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ca_score' => 'required|numeric|between:0,100',
            'fe_score' => 'nullable|numeric|between:0,100',
        ]);

        return response()->json([
            'data' => $this->analytics->predictGrade(
                $validated['ca_score'],
                $validated['fe_score'] ?? 0,
            ),
        ]);
    }

    public function enrollmentTrends(): JsonResponse
    {
        return response()->json([
            'data' => $this->analytics->enrollmentTrends(),
        ]);
    }
}
