<?php

return [
    'enabled' => env('AI_ASSISTANT_ENABLED', false),
    'api_key' => env('AI_ASSISTANT_API_KEY', ''),
    'api_url' => env('AI_ASSISTANT_API_URL', 'https://api.openai.com/v1/chat/completions'),
    'model' => env('AI_ASSISTANT_MODEL', 'gpt-4o-mini'),
    'max_tokens' => env('AI_ASSISTANT_MAX_TOKENS', 1024),
    'temperature' => env('AI_ASSISTANT_TEMPERATURE', 0.7),
];
