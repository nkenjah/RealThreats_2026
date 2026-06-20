<?php

return [
    /*
    |--------------------------------------------------------------------------
    | GePG Environment
    |--------------------------------------------------------------------------
    | Options: 'sandbox' | 'production'
    */
    'environment' => env('GEPG_ENVIRONMENT', 'sandbox'),

    /*
    |--------------------------------------------------------------------------
    | Institution Identifiers
    |--------------------------------------------------------------------------
    | Assigned by GePG during institution onboarding.
    */
    'institution_code' => env('GEPG_INSTITUTION_CODE'),
    'sub_sp_code' => env('GEPG_SUB_SP_CODE'),
    'sp_code' => env('GEPG_SP_CODE', 'SP111'),

    /*
    |--------------------------------------------------------------------------
    | API Endpoints
    |--------------------------------------------------------------------------
    */
    'endpoints' => [
        'sandbox' => [
            'base' => 'https://sandbox.gepg.go.tz/api',
            'bill_submission' => '/bill/submit',
            'payment_confirmation' => '/payment/confirm',
            'payment_reconciliation' => '/payment/reconcile',
            'control_number_cancel' => '/controlnumber/cancel',
        ],
        'production' => [
            'base' => 'https://api.gepg.go.tz/api',
            'bill_submission' => '/bill/submit',
            'payment_confirmation' => '/payment/confirm',
            'payment_reconciliation' => '/payment/reconcile',
            'control_number_cancel' => '/controlnumber/cancel',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | RSA Certificates
    |--------------------------------------------------------------------------
    | For request signing and callback verification.
    */
    'certificates' => [
        'public_key' => storage_path('app/gepg/gepg_public.cer'),
        'private_key' => storage_path('app/gepg/institution_private.key'),
        'passphrase' => env('GEPG_CERT_PASSPHRASE'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Control Number Settings
    |--------------------------------------------------------------------------
    */
    'control_number' => [
        'expiry_days' => env('GEPG_CTRL_NUM_EXPIRY', 30),
        'prefix' => env('GEPG_CTRL_NUM_PREFIX', 'INST'),
    ],

    'currency' => 'TZS',

    /*
    |--------------------------------------------------------------------------
    | Exam Card Payment Threshold
    |--------------------------------------------------------------------------
    | Minimum payment percentage required before student can generate exam card.
    */
    'exam_card_min_payment_percent' => env('EXAM_CARD_MIN_PAYMENT', 50),
];
