<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Services\AiAssistantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AiAssistantController extends Controller
{
    public function __construct(
        private readonly AiAssistantService $assistant,
    ) {}

    public function chat(Request $request): JsonResponse|RedirectResponse
    {
        if ($request->isMethod('get')) {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'history' => 'nullable|array',
            'history.*.role' => 'string|in:user,assistant',
            'history.*.content' => 'string',
        ]);

        $user = $request->user();
        $userContext = null;

        if ($user) {
            $userContext = [
                'Name' => $user->name,
                'Email' => $user->email,
                'Roles' => $user->getRoleNames()->implode(', '),
            ];

            $student = Student::where('email', $user->email)->first();
            if ($student) {
                $userContext['Registration Number'] = $student->registration_number;
                $userContext['Program'] = $student->program?->name;
                $userContext['Status'] = $student->status;
            }
        }

        return $this->assistant->chat(
            $validated['message'],
            $validated['history'] ?? [],
            $userContext,
        );
    }
}
