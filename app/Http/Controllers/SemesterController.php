<?php

namespace App\Http\Controllers;

use App\Models\SystemConfiguration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SemesterController extends Controller
{
    public function index(): Response
    {
        $configs = SystemConfiguration::where('config_group', 'semester')
            ->orderBy('config_key')
            ->get()
            ->keyBy('config_key');

        return Inertia::render('admin/semester/index', [
            'semester' => [
                'current_academic_year' => $configs->get('current_academic_year')?->config_value ?? '2025/2026',
                'current_semester' => $configs->get('current_semester')?->config_value ?? 'Semester 1',
                'semester_status' => $configs->get('semester_status')?->config_value ?? 'active',
                'grade_entry_open' => $configs->get('grade_entry_open')?->config_value ?? 'yes',
                'exam_card_generation_open' => $configs->get('exam_card_generation_open')?->config_value ?? 'yes',
                'semester_start_date' => $configs->get('semester_start_date')?->config_value ?? null,
                'semester_end_date' => $configs->get('semester_end_date')?->config_value ?? null,
                'exam_start_date' => $configs->get('exam_start_date')?->config_value ?? null,
                'exam_end_date' => $configs->get('exam_end_date')?->config_value ?? null,
            ],
        ]);
    }

    public function activate(): RedirectResponse
    {
        $this->setConfig('semester_status', 'active');
        $this->setConfig('grade_entry_open', 'yes');
        $this->setConfig('exam_card_generation_open', 'yes');

        broadcast(new SemesterStatusChangedEvent(
            'active',
            $this->getCurrentSemester(),
            $this->getCurrentAcademicYear(),
        ));

        activity()
            ->withProperties(['action' => 'activate'])
            ->log('Semester activated');

        return back()->with('success', 'Semester activated. Grade entry and exam card generation are now open.');
    }

    public function close(): RedirectResponse
    {
        $this->setConfig('semester_status', 'closed');
        $this->setConfig('grade_entry_open', 'no');
        $this->setConfig('exam_card_generation_open', 'no');

        broadcast(new SemesterStatusChangedEvent(
            'closed',
            $this->getCurrentSemester(),
            $this->getCurrentAcademicYear(),
        ));

        activity()
            ->withProperties(['action' => 'close'])
            ->log('Semester closed');

        return back()->with('success', 'Semester closed. Grade entry and exam card generation are now locked.');
    }

    public function toggleGradeEntry(): RedirectResponse
    {
        $current = SystemConfiguration::getValue('grade_entry_open', 'yes');
        $new = $current === 'yes' ? 'no' : 'yes';
        $this->setConfig('grade_entry_open', $new);

        return back()->with('success', 'Grade entry '.($new === 'yes' ? 'opened' : 'closed').'.');
    }

    public function toggleExamCard(): RedirectResponse
    {
        $current = SystemConfiguration::getValue('exam_card_generation_open', 'yes');
        $new = $current === 'yes' ? 'no' : 'yes';
        $this->setConfig('exam_card_generation_open', $new);

        return back()->with('success', 'Exam card generation '.($new === 'yes' ? 'opened' : 'closed').'.');
    }

    private function getCurrentSemester(): string
    {
        return SystemConfiguration::getValue('current_semester', 'Semester 1');
    }

    private function getCurrentAcademicYear(): string
    {
        return SystemConfiguration::getValue('current_academic_year', '2025/2026');
    }

    private function setConfig(string $key, string $value): void
    {
        SystemConfiguration::updateOrCreate(
            ['config_key' => $key],
            ['config_value' => $value, 'config_group' => 'semester'],
        );
        Cache::forget("system_config.{$key}");
    }
}
