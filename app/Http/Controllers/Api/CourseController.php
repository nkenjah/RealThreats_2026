<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $courses = Course::with(['program', 'department'])
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('code', 'like', "%{$s}%"))
            ->when($request->program_id, fn ($q, $id) => $q->where('program_id', $id))
            ->when($request->level, fn ($q, $l) => $q->where('level', $l))
            ->paginate($request->per_page ?? 15);

        return response()->json($courses);
    }

    public function show(Course $course): JsonResponse
    {
        $course->load(['program', 'department', 'offerings', 'prerequisites']);

        return response()->json(['data' => $course]);
    }
}
