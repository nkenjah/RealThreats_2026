<?php

namespace App\Http\Controllers;

use App\Models\CourseOffering;
use App\Models\Grade;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GradeUploadController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/grades/upload', [
            'courseOfferings' => CourseOffering::with('course')
                ->whereHas('course')
                ->orderBy('id')
                ->get()
                ->map(fn ($co) => [
                    'id' => $co->id,
                    'label' => ($co->course?->code ?? 'N/A').' - '.($co->course?->name ?? 'N/A').' ('.$co->academic_year.' '.$co->semester.')',
                ]),
        ]);
    }

    public function preview(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $courseOffering = CourseOffering::with('course')->findOrFail($validated['course_offering_id']);

        $rows = $this->parseCsv($request->file('file'));

        if (count($rows) < 1) {
            return back()->with('error', 'CSV file is empty or has invalid format.');
        }

        $headers = array_keys($rows[0]);
        $required = ['registration_number', 'grade'];
        $missing = array_diff($required, $headers);
        if (! empty($missing)) {
            return back()->with('error', 'Missing columns: '.implode(', ', $missing).'. Required: registration_number, grade, grade_points (optional).');
        }

        $preview = [];
        $errors = [];
        $validCount = 0;

        foreach ($rows as $i => $row) {
            $student = Student::where('registration_number', trim($row['registration_number']))->first();
            $gradePoints = isset($row['grade_points']) && $row['grade_points'] !== '' ? (float) $row['grade_points'] : null;
            $gradeLetter = strtoupper(trim($row['grade']));

            $rowErrors = [];

            if (! $student) {
                $rowErrors[] = 'Student not found';
            }

            if (! in_array($gradeLetter, ['A', 'B+', 'B', 'C', 'D', 'E', 'F'])) {
                $rowErrors[] = "Invalid grade: {$gradeLetter}";
            }

            $existing = null;
            if ($student) {
                $existing = Grade::where('student_id', $student->id)
                    ->where('course_offering_id', $courseOffering->id)
                    ->first();
            }

            $preview[] = [
                'row' => $i + 2,
                'registration_number' => $row['registration_number'],
                'student_name' => $student?->name ?? '—',
                'grade' => $gradeLetter,
                'grade_points' => $gradePoints,
                'existing' => $existing ? ($existing->grade.' / '.$existing->status) : '—',
                'errors' => $rowErrors,
                'valid' => empty($rowErrors),
            ];

            if (empty($rowErrors)) {
                $validCount++;
            } else {
                $errors = array_merge($errors, $rowErrors);
            }
        }

        request()->session()->flash('upload_preview', [
            'course_offering_id' => $courseOffering->id,
            'rows' => $preview,
        ]);

        return response()->json([
            'preview' => $preview,
            'total' => count($preview),
            'valid' => $validCount,
            'invalid' => count($preview) - $validCount,
            'course_offering' => [
                'id' => $courseOffering->id,
                'label' => ($courseOffering->course?->code ?? 'N/A').' - '.($courseOffering->course?->name ?? 'N/A'),
                'academic_year' => $courseOffering->academic_year,
                'semester' => $courseOffering->semester,
            ],
        ]);
    }

    public function confirm(Request $request): RedirectResponse
    {
        $preview = session('upload_preview');

        if (! $preview) {
            return back()->with('error', 'No upload preview found. Please upload a CSV file first.');
        }

        $courseOffering = CourseOffering::findOrFail($preview['course_offering_id']);
        $now = now();
        $userId = auth()->id();

        $imported = 0;
        $skipped = 0;

        foreach ($preview['rows'] as $item) {
            if (! $item['valid']) {
                $skipped++;

                continue;
            }

            $student = Student::where('registration_number', $item['registration_number'])->first();
            if (! $student) {
                $skipped++;

                continue;
            }

            $existing = Grade::where('student_id', $student->id)
                ->where('course_offering_id', $courseOffering->id)
                ->first();

            if ($existing) {
                $existing->update([
                    'grade' => $item['grade'],
                    'grade_points' => $item['grade_points'],
                    'status' => 'draft',
                    'submitted_by' => null,
                    'submitted_at' => null,
                    'approved_by' => null,
                    'approved_at' => null,
                ]);
            } else {
                Grade::create([
                    'student_id' => $student->id,
                    'course_offering_id' => $courseOffering->id,
                    'grade' => $item['grade'],
                    'grade_points' => $item['grade_points'],
                    'academic_year' => $courseOffering->academic_year,
                    'semester' => $courseOffering->semester,
                    'status' => 'draft',
                ]);
            }
            $imported++;
        }

        session()->forget('upload_preview');

        activity()
            ->withProperties([
                'course_offering_id' => $courseOffering->id,
                'imported' => $imported,
                'skipped' => $skipped,
            ])
            ->log("Grade CSV upload: {$imported} imported, {$skipped} skipped");

        return redirect()->route('admin.grades.index')
            ->with('success', "Grades imported: {$imported} created/updated, {$skipped} skipped.");
    }

    private function parseCsv($file): array
    {
        $handle = fopen($file->getRealPath(), 'r');
        if (! $handle) {
            return [];
        }

        $headers = fgetcsv($handle);
        if (! $headers) {
            fclose($handle);

            return [];
        }

        $headers = array_map(fn ($h) => trim(strtolower(str_replace("\xEF\xBB\xBF", '', $h))), $headers);

        $rows = [];
        while (($data = fgetcsv($handle)) !== false) {
            $row = [];
            foreach ($headers as $i => $header) {
                $row[$header] = $data[$i] ?? '';
            }
            $rows[] = $row;
        }

        fclose($handle);

        return $rows;
    }
}
