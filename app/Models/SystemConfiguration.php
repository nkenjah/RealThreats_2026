<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

#[Fillable(['config_key', 'config_value', 'config_group', 'description'])]
class SystemConfiguration extends Model
{
    public static function getValue(string $key, string|int|bool|null $default = null): string|int|bool|null
    {
        return Cache::remember("system_config.{$key}", 300, fn () => static::query()
            ->where('config_key', $key)
            ->value('config_value') ?? $default);
    }
}
