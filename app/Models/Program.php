<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'code', 'description', 'duration_years', 'total_credits'])]
class Program extends Model
{
    public function programRequirements(): HasMany
    {
        return $this->hasMany(ProgramRequirement::class);
    }

    public function courseOfferings(): HasMany
    {
        return $this->hasMany(CourseOffering::class);
    }

    public function academicTranscripts(): HasMany
    {
        return $this->hasMany(AcademicTranscript::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function degreeAudits(): HasMany
    {
        return $this->hasMany(DegreeAudit::class);
    }
}
