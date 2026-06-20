<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Result Slip</title>
    <style>
        @page {
            margin: 18mm 14mm;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10pt;
            color: #1a1a1a;
            line-height: 1.5;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #1a56db;
            padding-bottom: 10px;
            margin-bottom: 16px;
        }
        .header h1 {
            font-size: 16pt;
            color: #1a56db;
            margin: 0 0 2px;
        }
        .header p {
            font-size: 9pt;
            color: #6b7280;
            margin: 0;
        }
        .header .title {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 4px;
            color: #1a1a1a;
        }
        .student-info {
            margin-bottom: 14px;
            padding: 10px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
        }
        .student-info table {
            width: 100%;
            border-collapse: collapse;
        }
        .student-info td {
            padding: 2px 6px;
            font-size: 9pt;
        }
        .student-info .label {
            color: #6b7280;
            width: 130px;
        }
        .student-info .value {
            font-weight: bold;
        }
        .summary-grid {
            display: flex;
            gap: 10px;
            margin-bottom: 14px;
        }
        .summary-box {
            flex: 1;
            padding: 8px 10px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            text-align: center;
        }
        .summary-box .label {
            font-size: 7.5pt;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary-box .value {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 2px;
        }
        .summary-box.gpa { background: #eff6ff; border-color: #bfdbfe; }
        .summary-box.cgpa { background: #f0fdf4; border-color: #bbf7d0; }
        .summary-box.credits { background: #fefce8; border-color: #fde68a; }
        .summary-box.status { background: #faf5ff; border-color: #e9d5ff; }
        table.grades {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        table.grades th {
            background: #1a56db;
            color: #fff;
            padding: 6px 8px;
            text-align: left;
            font-size: 8pt;
            text-transform: uppercase;
        }
        table.grades td {
            padding: 5px 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 8.5pt;
        }
        table.grades tr:nth-child(even) {
            background: #f9fafb;
        }
        .grade-badge {
            display: inline-block;
            padding: 1px 8px;
            border-radius: 10px;
            font-size: 8pt;
            font-weight: bold;
        }
        .grade-A { background: #d1fae5; color: #065f46; }
        .grade-B { background: #dbeafe; color: #1e40af; }
        .grade-C { background: #fef3c7; color: #92400e; }
        .grade-D { background: #fff7ed; color: #9a3412; }
        .grade-E { background: #fce7f3; color: #9d174d; }
        .grade-F { background: #fee2e2; color: #991b1b; }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 7.5pt;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 6px;
        }
        .terms {
            margin-top: 12px;
            font-size: 7.5pt;
            color: #6b7280;
            border-top: 1px dashed #d1d5db;
            padding-top: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>KIUT University</h1>
        <p>Kampala International University in Tanzania</p>
        <div class="title">Student Result Slip</div>
    </div>

    <div class="student-info">
        <table>
            <tr><td class="label">Name</td><td class="value">{{ $student->name }}</td></tr>
            <tr><td class="label">Registration No.</td><td class="value">{{ $student->registration_number }}</td></tr>
            <tr><td class="label">Program</td><td class="value">{{ $student->program }}</td></tr>
            <tr><td class="label">Year of Study</td><td class="value">{{ $student->year_of_study }}</td></tr>
            <tr><td class="label">Department</td><td class="value">{{ $student->department?->name ?? 'N/A' }}</td></tr>
            <tr><td class="label">Academic Year</td><td class="value">{{ $academic_year }}</td></tr>
            <tr><td class="label">Semester</td><td class="value">{{ $semester }}</td></tr>
        </table>
    </div>

    <div class="summary-grid">
        <div class="summary-box gpa">
            <div class="label">Semester GPA</div>
            <div class="value">{{ number_format($semester_gpa, 2) }}</div>
        </div>
        <div class="summary-box cgpa">
            <div class="label">CGPA</div>
            <div class="value">{{ number_format($cgpa, 2) }}</div>
        </div>
        <div class="summary-box credits">
            <div class="label">Credits</div>
            <div class="value">{{ $earned_credits }}/{{ $total_credits }}</div>
        </div>
        <div class="summary-box status">
            <div class="label">Status</div>
            <div class="value" style="font-size: 8pt;">{{ str_replace('_', ' ', ucfirst($academic_status)) }}</div>
        </div>
    </div>

    <h3 style="margin: 0 0 4px; font-size: 10pt;">Course Results</h3>

    <table class="grades">
        <thead>
            <tr>
                <th>#</th>
                <th>Code</th>
                <th>Course Name</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($grades as $i => $grade)
            @php
                $credits = $grade->courseOffering?->course?->credit_hours ?? 3;
                $gradeClass = 'grade-' . str_replace('+', '', $grade->grade);
            @endphp
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $grade->courseOffering?->course?->code ?? 'N/A' }}</td>
                <td>{{ $grade->courseOffering?->course?->name ?? 'N/A' }}</td>
                <td>{{ $credits }}</td>
                <td><span class="grade-badge {{ $gradeClass }}">{{ $grade->grade }}</span></td>
                <td>{{ number_format($grade->grade_points ?? 0, 1) }}</td>
            </tr>
            @empty
            <tr><td colspan="6" style="text-align: center; color: #9ca3af; padding: 16px;">No grades recorded for this semester.</td></tr>
            @endforelse
        </tbody>
    </table>

    <p style="margin-top: 8px; font-size: 8pt; color: #6b7280;">
        <strong>Degree Classification:</strong> {{ $classification }}
    </p>

    <div class="terms">
        <strong>Notes:</strong>
        <ul style="margin: 2px 0 0; padding-left: 16px;">
            <li>Grade E = Supplementary exam eligible | Grade F = Retake required</li>
            <li>CGPA is calculated across all semesters completed to date.</li>
            <li>This is a computer-generated document. Signature not required.</li>
        </ul>
        <p style="margin-top: 6px;">Generated on: {{ $generated_at }}</p>
    </div>

    <div class="footer">
        <p>KIUT University &bull; www.kiut.ac.tz &bull; Academic Registrar's Office</p>
    </div>
</body>
</html>
