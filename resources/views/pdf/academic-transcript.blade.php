<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Academic Transcript</title>
    <style>
        @page { margin: 16mm 14mm; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10pt; color: #1a1a1a; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #1a56db; padding-bottom: 10px; margin-bottom: 16px; }
        .header h1 { font-size: 16pt; color: #1a56db; margin: 0; }
        .header p { font-size: 9pt; color: #6b7280; margin: 2px 0; }
        .watermark { position: fixed; top: 40%; left: 20%; font-size: 48pt; color: rgba(0,0,0,0.04); transform: rotate(-30deg); font-weight: bold; z-index: -1; }
        .student-info { margin-bottom: 14px; padding: 10px; background: #f9fafb; border: 1px solid #e5e7eb; }
        .student-info table { width: 100%; border-collapse: collapse; }
        .student-info td { padding: 2px 6px; font-size: 9pt; }
        .student-info .label { color: #6b7280; width: 140px; }
        .student-info .value { font-weight: bold; }
        .summary-box { display: inline-block; width: 30%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; text-align: center; margin: 6px 1%; }
        .summary-box .label { font-size: 7pt; color: #6b7280; }
        .summary-box .value { font-size: 11pt; font-weight: bold; }
        table.grades { width: 100%; border-collapse: collapse; margin-top: 8px; }
        table.grades th { background: #1a56db; color: #fff; padding: 5px 7px; text-align: left; font-size: 8pt; }
        table.grades td { padding: 4px 7px; border-bottom: 1px solid #e5e7eb; font-size: 8pt; }
        table.grades tr:nth-child(even) { background: #f9fafb; }
        .footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 7pt; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 6px; }
        .verify-badge { text-align: center; margin-top: 12px; padding: 8px; border: 1px dashed #bfdbfe; background: #eff6ff; border-radius: 4px; font-size: 8pt; }
    </style>
</head>
<body>
    <div class="watermark">VERIFIED</div>

    <div class="header">
        <h1>KIUT University</h1>
        <p>Kampala International University in Tanzania</p>
        <p style="margin-top: 4px; font-size: 11pt;"><strong>Official Academic Transcript</strong></p>
    </div>

    <div class="student-info">
        <table>
            <tr><td class="label">Name</td><td class="value">{{ $student->name }}</td></tr>
            <tr><td class="label">Registration No.</td><td class="value">{{ $student->registration_number }}</td></tr>
            <tr><td class="label">Program</td><td class="value">{{ $transcript->program?->name ?? $student->program }}</td></tr>
            <tr><td class="label">Department</td><td class="value">{{ $student->department?->name ?? 'N/A' }}</td></tr>
        </table>
    </div>

    <div style="text-align: center;">
        <div class="summary-box">
            <div class="label">Cumulative GPA</div>
            <div class="value">{{ number_format($transcript->cumulative_gpa, 2) }}</div>
        </div>
        <div class="summary-box">
            <div class="label">Total Credits</div>
            <div class="value">{{ $transcript->total_credits_earned }}</div>
        </div>
        <div class="summary-box">
            <div class="label">Issued</div>
            <div class="value" style="font-size: 8pt;">{{ \Carbon\Carbon::parse($transcript->generated_at)->format('d/m/Y') }}</div>
        </div>
    </div>

    <h3 style="margin: 8px 0 4px; font-size: 10pt;">Academic Record</h3>

    @php
        $currentYear = '';
    @endphp

    <table class="grades">
        <thead>
            <tr>
                <th>Year</th>
                <th>Sem</th>
                <th>Code</th>
                <th>Course Name</th>
                <th>Cr</th>
                <th>Grade</th>
                <th>Pts</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($grades as $grade)
            @php
                $credits = $grade->courseOffering?->course?->credit_hours ?? 3;
            @endphp
            <tr>
                <td>{{ $grade->academic_year }}</td>
                <td>{{ $grade->semester }}</td>
                <td>{{ $grade->courseOffering?->course?->code ?? 'N/A' }}</td>
                <td>{{ $grade->courseOffering?->course?->name ?? 'N/A' }}</td>
                <td>{{ $credits }}</td>
                <td><strong>{{ $grade->grade }}</strong></td>
                <td>{{ number_format($grade->grade_points ?? 0, 1) }}</td>
            </tr>
            @empty
            <tr><td colspan="7" style="text-align: center; color: #9ca3af;">No grades recorded.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="verify-badge">
        <strong>Verification:</strong> Scan QR or visit {{ $verification_url }}<br>
        Hash: {{ $transcript->verification_hash }}<br>
        This document is digitally verifiable.
    </div>

    <div class="footer">
        <p>KIUT University &bull; www.kiut.ac.tz &bull; Office of the Academic Registrar</p>
    </div>
</body>
</html>
