<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $grades = Grade::with(['student', 'courseOffering.course'])
            ->when($request->student_id, fn ($q, $id) => $q->where('student_id', $id))
            ->when($request->course_offering_id, fn ($q, $id) => $q->where('course_offering_id', $id))
            ->when($request->academic_year, fn ($q, $y) => $q->where('academic_year', $y))
            ->when($request->semester, fn ($q, $s) => $q->where('semester', $s))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json($grades);
    }

    public function show(Grade $grade): JsonResponse
    {
        $grade->load(['student', 'courseOffering.course', 'courseOffering.gradebookComponents']);

        return response()->json(['data' => $grade]);
    }
}
