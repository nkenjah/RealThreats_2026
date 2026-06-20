<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Exam Card</title>
    <style>
        @page {
            margin: 20mm 15mm;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11pt;
            color: #1a1a1a;
            line-height: 1.5;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #1a56db;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 18pt;
            color: #1a56db;
            margin: 0 0 4px;
        }
        .header p {
            font-size: 10pt;
            color: #6b7280;
            margin: 0;
        }
        .badge {
            display: inline-block;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 10pt;
            font-weight: bold;
            margin-top: 8px;
        }
        .badge-eligible {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #059669;
        }
        .student-info {
            margin-bottom: 20px;
            padding: 12px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
        }
        .student-info table {
            width: 100%;
            border-collapse: collapse;
        }
        .student-info td {
            padding: 3px 8px;
            font-size: 10pt;
        }
        .student-info .label {
            color: #6b7280;
            width: 140px;
        }
        .student-info .value {
            font-weight: bold;
        }
        table.courses {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }
        table.courses th {
            background: #1a56db;
            color: #fff;
            padding: 8px 10px;
            text-align: left;
            font-size: 9pt;
            text-transform: uppercase;
        }
        table.courses td {
            padding: 7px 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 9.5pt;
        }
        table.courses tr:nth-child(even) {
            background: #f9fafb;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8pt;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
        }
        .footer .qr-placeholder {
            margin-top: 6px;
            font-size: 7pt;
            color: #6b7280;
        }
        .terms {
            margin-top: 16px;
            font-size: 8pt;
            color: #6b7280;
            border-top: 1px dashed #d1d5db;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>KIUT University</h1>
        <p>Kampala International University in Tanzania</p>
        <p style="margin-top: 4px;"><strong>Examination Admission Card</strong></p>
        <div class="badge badge-eligible">ELIGIBLE</div>
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

    <h3 style="margin: 0 0 4px; font-size: 11pt;">Registered Courses &amp; Exam Schedule</h3>

    <table class="courses">
        <thead>
            <tr>
                <th>#</th>
                <th>Code</th>
                <th>Course Name</th>
                <th>Section</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Duration</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($courses as $i => $course)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $course['code'] }}</td>
                <td>{{ $course['name'] }}</td>
                <td>{{ $course['section'] }}</td>
                <td>{{ $course['exam_date'] }}</td>
                <td>{{ $course['exam_time'] }}</td>
                <td>{{ $course['venue'] }}</td>
                <td>{{ $course['duration'] }}min</td>
            </tr>
            @empty
            <tr>
                <td colspan="8" style="text-align: center; color: #9ca3af; padding: 20px;">
                    No courses registered for this semester.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="terms">
        <strong>Terms &amp; Conditions:</strong>
        <ol style="margin: 4px 0 0; padding-left: 18px;">
            <li>This card must be presented at each examination venue.</li>
            <li>Students without this card and a valid university ID will not be admitted.</li>
            <li>Any form of examination malpractice will lead to automatic discontinuation.</li>
            <li>Mobile phones and unauthorized materials are strictly prohibited in exam halls.</li>
        </ol>
        <p style="margin-top: 8px;">
            Generated on: {{ $generated_at }} &mdash; This is a computer-generated document.
        </p>
    </div>

    <div class="footer">
        <p>KIUT University &bull; www.kiut.ac.tz &bull; Examination Department</p>
    </div>
</body>
</html>
