<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $exams = Exam::with('course')
            ->when($request->course_id, fn ($q, $id) => $q->where('course_id', $id))
            ->when($request->date, fn ($q, $d) => $q->whereDate('starts_at', $d))
            ->when($request->upcoming, fn ($q) => $q->where('starts_at', '>=', now()))
            ->orderBy('starts_at')
            ->paginate($request->per_page ?? 15);

        return response()->json($exams);
    }

    public function show(Exam $exam): JsonResponse
    {
        $exam->load('course');

        return response()->json(['data' => $exam]);
    }
}
