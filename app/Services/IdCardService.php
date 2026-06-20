<?php

namespace App\Services;

use chillerlan\QRCode\Output\QRGdImagePNG;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;

class IdCardService
{
    public function generateQrCode(string $data): string
    {
        $options = new QROptions([
            'outputInterface' => QRGdImagePNG::class,
            'eccLevel' => 'L',
            'scale' => 8,
            'outputBase64' => true,
        ]);

        return (new QRCode($options))->render($data);
    }

    public function getStudentQrData(int $studentId, string $regNumber, string $name): string
    {
        return json_encode([
            'type' => 'student',
            'id' => $studentId,
            'reg' => $regNumber,
            'name' => $name,
            'v' => '1',
        ]);
    }

    public function getStaffQrData(int $staffId, string $staffNumber, string $name): string
    {
        return json_encode([
            'type' => 'staff',
            'id' => $staffId,
            'staff_no' => $staffNumber,
            'name' => $name,
            'v' => '1',
        ]);
    }

    public function generateInitialsAvatar(string $name): string
    {
        $words = explode(' ', trim($name));
        $initials = '';
        foreach ($words as $word) {
            if (! empty($word)) {
                $initials .= strtoupper($word[0]);
            }
        }
        $initials = substr($initials, 0, 2);
        if (empty($initials)) {
            $initials = '?';
        }

        $colors = ['#1a56db', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];
        $index = crc32($name) % count($colors);
        $bg = $colors[$index];

        $size = 200;
        $img = imagecreatetruecolor($size, $size);
        $bgColor = sscanf($bg, '#%02x%02x%02x');
        imagefill($img, 0, 0, imagecolorallocate($img, $bgColor[0], $bgColor[1], $bgColor[2]));

        $white = imagecolorallocate($img, 255, 255, 255);
        $fontSize = 5;
        $box = imagettfbbox(60, 0, base_path('vendor/dompdf/dompdf/lib/fonts/DejaVuSans-Bold.ttf'), $initials);
        if ($box === false) {
            $fontSize = 80;
            $fw = imagefontwidth($fontSize) * strlen($initials);
            $fh = imagefontheight($fontSize);
            $x = ($size - $fw) / 2;
            $y = ($size - $fh) / 2 + $fh;
            imagestring($img, $fontSize, (int) $x, (int) $y, $initials, $white);
        } else {
            $tw = abs($box[2] - $box[0]);
            $th = abs($box[7] - $box[1]);
            $x = ($size - $tw) / 2;
            $y = ($size - $th) / 2 + $th;
            imagettftext($img, 60, 0, (int) $x, (int) $y, $white, base_path('vendor/dompdf/dompdf/lib/fonts/DejaVuSans-Bold.ttf'), $initials);
        }

        ob_start();
        imagepng($img);
        $png = ob_get_clean();
        imagedestroy($img);

        return 'data:image/png;base64,'.base64_encode($png);
    }
}
