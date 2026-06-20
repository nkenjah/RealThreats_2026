<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiAssistantService
{
    protected string $apiKey;

    protected string $apiUrl;

    protected string $model;

    protected int $maxTokens;

    protected float $temperature;

    public function __construct()
    {
        $this->apiKey = config('ai-assistant.api_key');
        $this->apiUrl = config('ai-assistant.api_url');
        $this->model = config('ai-assistant.model');
        $this->maxTokens = (int) config('ai-assistant.max_tokens');
        $this->temperature = (float) config('ai-assistant.temperature');
    }

    public function isEnabled(): bool
    {
        return config('ai-assistant.enabled') && (! empty($this->apiKey) || str_contains($this->apiUrl, 'localhost:11434'));
    }

    public function buildSystemPrompt(?array $userContext = null): string
    {
        $prompt = <<<'PROMPT'
You are KIUT-AI, an intelligent assistant for Kampala International University in Tanzania (KIUT).
You help students, faculty, and staff with university-related questions.

You can answer questions about:
- Courses, programs, and academic policies
- Exam schedules and results
- Fee structures, payments, and financial aid (HESLB)
- Admission requirements and application status
- Library services
- Student housing (dormitories and hostels)
- Graduation requirements and clearance
- University policies and procedures

Keep responses concise, accurate, and helpful. If you don't know something, say so.
Use a professional but friendly tone. Format responses in plain text with occasional markdown for emphasis.
PROMPT;

        if ($userContext) {
            $prompt .= "\n\nCurrent user context:\n";
            foreach ($userContext as $key => $value) {
                $prompt .= "- {$key}: {$value}\n";
            }
            $prompt .= "\nUse this context to personalize your responses when relevant.";
        }

        $prompt .= "\n\nCurrent date: ".now()->format('Y-m-d H:i:s').' (East Africa Time)';

        return $prompt;
    }

    public function chat(string $message, array $history = [], ?array $userContext = null): JsonResponse
    {
        if (! $this->isEnabled()) {
            $reason = config('ai-assistant.enabled') ? 'API key not configured' : 'AI Assistant is disabled';

            return response()->json([
                'reply' => 'AI Assistant is not available ('.$reason.'). Please contact the system administrator to enable it.',
            ]);
        }

        $messages = [
            ['role' => 'system', 'content' => $this->buildSystemPrompt($userContext)],
        ];

        foreach (array_slice($history, -10) as $msg) {
            $messages[] = [
                'role' => $msg['role'] ?? 'user',
                'content' => $msg['content'] ?? '',
            ];
        }

        $messages[] = ['role' => 'user', 'content' => $message];

        $this->warmUpModel();

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(120)->post($this->apiUrl, [
                'model' => $this->model,
                'messages' => $messages,
                'max_tokens' => $this->maxTokens,
                'temperature' => $this->temperature,
                'stream' => false,
                'keep_alive' => '30m',
            ]);

            if (! $response->successful()) {
                Log::error('AI Assistant API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                $status = $response->status();
                $hint = match (true) {
                    $status === 401 || $status === 403 => 'Authentication failed. Check your API key.',
                    $status === 404 => 'API endpoint not found. Check your API URL.',
                    $status === 405 => 'API method not allowed. The endpoint only accepts POST requests.',
                    $status === 429 => 'Rate limit exceeded. Please wait and try again.',
                    $status >= 500 => 'The AI service is experiencing issues. Please try again later.',
                    default => 'An unexpected error occurred. Please try again.',
                };

                return response()->json([
                    'reply' => 'Sorry, I encountered an error: '.$hint,
                ]);
            }

            $data = $response->json();
            $reply = $data['message']['content']
                ?? $data['choices'][0]['message']['content']
                ?? 'No response generated.';

            return response()->json(['reply' => $reply]);
        } catch (\Exception $e) {
            Log::error('AI Assistant exception: '.$e->getMessage());

            $hint = str_contains($e->getMessage(), 'cURL') || str_contains($e->getMessage(), 'Connection')
                ? 'Could not connect to the AI service. Make sure Ollama is running (ollama serve).'
                : 'Please try again later.';

            return response()->json([
                'reply' => 'Sorry, I encountered a technical issue. '.$hint,
            ]);
        }
    }

    protected function warmUpModel(): void
    {
        try {
            Http::timeout(5)->post($this->apiUrl, [
                'model' => $this->model,
                'messages' => [['role' => 'user', 'content' => 'ping']],
                'max_tokens' => 1,
                'stream' => false,
            ]);
        } catch (\Exception) {
        }
    }
}
