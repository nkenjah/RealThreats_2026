<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $students = Student::with(['program', 'enrollments.courseOffering.course'])
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('registration_number', 'like', "%{$s}%"))
            ->when($request->program_id, fn ($q, $id) => $q->where('program_id', $id))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->paginate($request->per_page ?? 15);

        return response()->json($students);
    }

    public function show(Student $student): JsonResponse
    {
        $student->load(['program', 'user', 'enrollments.courseOffering.course', 'grades.courseOffering']);

        return response()->json(['data' => $student]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => 'required|string|unique:students,registration_number',
            'email' => 'nullable|email|unique:students,email',
            'phone' => 'nullable|string|max:20',
            'program_id' => 'required|exists:programs,id',
            'status' => 'nullable|string|in:active,graduated,suspended,withdrawn',
        ]);

        $student = Student::create($validated);

        return response()->json(['data' => $student], 201);
    }

    public function update(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'nullable|email|unique:students,email,'.$student->id,
            'phone' => 'nullable|string|max:20',
            'program_id' => 'sometimes|exists:programs,id',
            'status' => 'nullable|string|in:active,graduated,suspended,withdrawn',
        ]);

        $student->update($validated);

        return response()->json(['data' => $student]);
    }

    public function destroy(Student $student): JsonResponse
    {
        $student->delete();

        return response()->json(['message' => 'Student deleted.']);
    }
}
