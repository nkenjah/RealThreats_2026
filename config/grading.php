<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Tanzanian Grading Scale (TCU Standard)
    |--------------------------------------------------------------------------
    |
    | Defines the standard grading scale used across Tanzanian Higher Education
    | institutions as regulated by the Tanzania Commission for Universities (TCU).
    |
    */
    'scale' => [
        ['min' => 75, 'max' => 100, 'grade' => 'A',  'points' => 5.0, 'status' => 'pass',     'label' => 'Excellent'],
        ['min' => 70, 'max' => 74,  'grade' => 'B+', 'points' => 4.5, 'status' => 'pass',     'label' => 'Very Good'],
        ['min' => 65, 'max' => 69,  'grade' => 'B',  'points' => 4.0, 'status' => 'pass',     'label' => 'Good'],
        ['min' => 55, 'max' => 64,  'grade' => 'C',  'points' => 3.0, 'status' => 'pass',     'label' => 'Satisfactory'],
        ['min' => 40, 'max' => 54,  'grade' => 'D',  'points' => 2.0, 'status' => 'pass',     'label' => 'Marginal Pass'],
        ['min' => 35, 'max' => 39,  'grade' => 'E',  'points' => 1.0, 'status' => 'supp',     'label' => 'Fail (Supplementary)'],
        ['min' => 0,  'max' => 34,  'grade' => 'F',  'points' => 0.0, 'status' => 'retake',   'label' => 'Fail (Retake)'],
    ],

    /*
    |--------------------------------------------------------------------------
    | TCU GPA Thresholds
    |--------------------------------------------------------------------------
    |
    | Minimum GPA thresholds for academic standing.
    |
    */
    'thresholds' => [
        'good_standing' => 2.0,
        'probation' => 1.5,
        'discontinuation_consecutive_semesters' => 2,
    ],

    /*
    |--------------------------------------------------------------------------
    | Assessment Weight Distribution
    |--------------------------------------------------------------------------
    |
    | Standard Tanzanian higher education assessment structure:
    | - Continuous Assessment (CA): 40%
    | - Final Examination (FE): 60%
    |
    */
    'ca_weight' => 0.40,
    'fe_weight' => 0.60,

    /*
    |--------------------------------------------------------------------------
    | Classification Bands (Bachelor Degrees)
    |--------------------------------------------------------------------------
    |
    | CGPA ranges for degree classification.
    |
    */
    'classifications' => [
        ['min' => 4.4, 'max' => 5.0, 'label' => 'First Class with Honours'],
        ['min' => 3.5, 'max' => 4.3, 'label' => 'Upper Second Class with Honours'],
        ['min' => 2.7, 'max' => 3.4, 'label' => 'Lower Second Class with Honours'],
        ['min' => 2.0, 'max' => 2.6, 'label' => 'Pass'],
        ['min' => 0.0, 'max' => 1.9, 'label' => 'Fail'],
    ],
];
