<?php

namespace App\Http\Controllers;

use App\Models\FacultyStaff;
use App\Models\Student;
use App\Services\IdCardService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class IdCardController extends Controller
{
    public function __construct(private readonly IdCardService $idCardService) {}

    public function student(Student $student): Response
    {
        $student->load('department');

        $qrData = $this->idCardService->getStudentQrData(
            $student->id,
            $student->registration_number,
            $student->name,
        );
        $qrCode = $this->idCardService->generateQrCode($qrData);
        $avatar = $this->idCardService->generateInitialsAvatar($student->name);

        $pdf = Pdf::loadView('pdf.id-card', [
            'person' => $student,
            'type' => 'student',
            'idNumber' => $student->registration_number,
            'secondaryInfo' => $student->program,
            'extraInfo' => 'Year '.$student->year_of_study,
            'department' => $student->department?->name ?? 'N/A',
            'email' => $student->email,
            'qrCode' => $qrCode,
            'avatar' => $avatar,
            'generated_at' => now()->format('d/m/Y H:i'),
        ]);

        return $pdf->download('id-card-'.str_replace('/', '-', $student->registration_number).'.pdf');
    }

    public function staff(FacultyStaff $facultyStaff): Response
    {
        $facultyStaff->load(['user', 'department']);

        $qrData = $this->idCardService->getStaffQrData(
            $facultyStaff->id,
            $facultyStaff->staff_number,
            $facultyStaff->user?->name ?? 'Staff',
        );
        $qrCode = $this->idCardService->generateQrCode($qrData);
        $avatar = $this->idCardService->generateInitialsAvatar($facultyStaff->user?->name ?? 'Staff');

        $pdf = Pdf::loadView('pdf.id-card', [
            'person' => $facultyStaff,
            'type' => 'staff',
            'idNumber' => $facultyStaff->staff_number,
            'secondaryInfo' => $facultyStaff->job_title,
            'extraInfo' => ucfirst($facultyStaff->contract_type),
            'department' => $facultyStaff->department?->name ?? 'N/A',
            'email' => $facultyStaff->user?->email ?? 'N/A',
            'qrCode' => $qrCode,
            'avatar' => $avatar,
            'generated_at' => now()->format('d/m/Y H:i'),
        ]);

        return $pdf->download('id-card-'.$facultyStaff->staff_number.'.pdf');
    }
}
