<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ID Card</title>
    <style>
        @page {
            margin: 0;
            size: 85.6mm 54mm;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 0;
            width: 85.6mm;
            height: 54mm;
            background: #fff;
        }
        .card {
            width: 100%;
            height: 100%;
            display: flex;
            position: relative;
            overflow: hidden;
        }
        .card-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #1a56db 0%, #1e40af 100%);
            opacity: 0.03;
        }
        .photo-section {
            width: 35%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 8px 6px;
            background: #f8fafc;
            border-right: 1px solid #e2e8f0;
        }
        .photo-section .avatar {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #1a56db;
            margin-bottom: 6px;
        }
        .photo-section .type-badge {
            font-size: 6pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #fff;
            background: #1a56db;
            padding: 2px 10px;
            border-radius: 10px;
        }
        .info-section {
            flex: 1;
            padding: 10px 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .info-section .university {
            font-size: 8pt;
            font-weight: bold;
            color: #1a56db;
            margin-bottom: 1px;
        }
        .info-section .campus {
            font-size: 5.5pt;
            color: #6b7280;
            margin-bottom: 6px;
        }
        .info-section .name {
            font-size: 10pt;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 2px;
            line-height: 1.2;
        }
        .info-section .id-number {
            font-size: 7pt;
            font-family: 'DejaVu Sans Mono', monospace;
            color: #1a56db;
            font-weight: bold;
            margin-bottom: 4px;
        }
        .info-section .detail-row {
            font-size: 6.5pt;
            color: #4b5563;
            margin-bottom: 1px;
        }
        .info-section .detail-row .label {
            color: #9ca3af;
        }
        .info-section .validity {
            font-size: 5.5pt;
            color: #059669;
            margin-top: 4px;
        }
        .qr-section {
            position: absolute;
            bottom: 6px;
            right: 8px;
            text-align: center;
        }
        .qr-section img {
            width: 32px;
            height: 32px;
        }
        .qr-section .qr-label {
            font-size: 4.5pt;
            color: #9ca3af;
            margin-top: 1px;
        }
        .watermark {
            position: absolute;
            bottom: 4px;
            left: 8px;
            font-size: 4.5pt;
            color: #d1d5db;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="card-background"></div>

        <div class="photo-section">
            <img class="avatar" src="{{ $avatar }}" alt="Photo" />
            <span class="type-badge">{{ $type }}</span>
        </div>

        <div class="info-section">
            <div class="university">KIUT University</div>
            <div class="campus">Kampala International University in Tanzania</div>
            <div class="name">{{ $person->user->name ?? $person->name }}</div>
            <div class="id-number">{{ $idNumber }}</div>
            <div class="detail-row"><span class="label">Dept: </span>{{ $department }}</div>
            <div class="detail-row"><span class="label">{{ $type === 'student' ? 'Program' : 'Title' }}: </span>{{ $secondaryInfo }}</div>
            <div class="detail-row"><span class="label">{{ $type === 'student' ? 'Year' : 'Type' }}: </span>{{ $extraInfo }}</div>
            <div class="validity">Valid Academic Year {{ now()->format('Y') }}/{{ now()->format('Y') + 1 }}</div>
        </div>

        <div class="qr-section">
            <img src="{{ $qrCode }}" alt="QR" />
            <div class="qr-label">SCAN TO VERIFY</div>
        </div>

        <div class="watermark">ID-CARD | {{ $generated_at }}</div>
    </div>
</body>
</html>
