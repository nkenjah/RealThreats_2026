<?php

namespace App\Http\Controllers;

use App\Models\SystemConfiguration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SystemConfigController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/system-config/index', [
            'groups' => SystemConfiguration::orderBy('config_group')->orderBy('config_key')->get()->groupBy('config_group'),
        ]);
    }

    public function update(Request $request, SystemConfiguration $config): RedirectResponse
    {
        $validated = $request->validate(['config_value' => ['required', 'string', 'max:255']]);
        $config->update($validated);
        Cache::forget("system_config.{$config->config_key}");

        return back()->with('success', 'Configuration updated.');
    }
}
