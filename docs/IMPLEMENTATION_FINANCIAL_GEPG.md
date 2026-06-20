# Implementation Strategy — Financial Management & GePG Integration

## Current State Assessment

The codebase has full CRUD infrastructure:

- `fees` table + `FeeController` + pages
- `financial_accounts` table + `FinancialAccountController` + pages
- `payments` table + `PaymentController` + pages
- `tuition_invoices` table + `InvoiceLineItem` (no dedicated controller)
- `fund_sources` table + `FundSourceController` + pages
- `scholarship_awards` table + `ScholarshipAwardController` + pages
- `disbursements` table (no dedicated controller)

**Missing**: GePG API integration, HESLB loan matching, fee block/unblock logic for exam cards, automated invoice generation, real-time financial dashboards.

---

## Phase 1: GePG Integration

### 1.1 Understanding GePG (Government Electronic Payment Gateway)

GePG is Tanzania's centralized government payment system. All public institutions must route fee collections through GePG.

**GePG Flow:**

```
1. Institution generates bill (Control Number) for a student
2. Control Number is communicated to the student (SMS/Email/Portal)
3. Student pays at any GePG-partner bank (CRDB, NMB, etc.) or mobile money (M-Pesa, TigoPesa, AirtelMoney)
4. GePG sends payment confirmation to institution via callback API
5. Institution reconciles and updates student account
```

### 1.2 Create GePG Configuration

Create `config/gepg.php`:

```php
<?php

return [
    /*
     * GePG Environment
     * Options: 'sandbox' | 'production'
     */
    'environment' => env('GEPG_ENVIRONMENT', 'sandbox'),

    /*
     * Institution identifiers assigned by GePG
     */
    'institution_code' => env('GEPG_INSTITUTION_CODE'),
    'sub_sp_code' => env('GEPG_SUB_SP_CODE'),       // Sub-SP Code (institution)
    'sp_code' => env('GEPG_SP_CODE', 'SP111'),      // Service Provider Code

    /*
     * API Endpoints
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
     * GePG RSA Certificate paths for request signing
     */
    'certificates' => [
        'public_key' => storage_path('app/gepg/gepg_public.cer'),
        'private_key' => storage_path('app/gepg/institution_private.key'),
        'passphrase' => env('GEPG_CERT_PASSPHRASE'),
    ],

    /*
     * Control number settings
     */
    'control_number' => [
        'expiry_days' => env('GEPG_CTRL_NUM_EXPIRY', 30),
        'prefix' => env('GEPG_CTRL_NUM_PREFIX', 'INST'),
    ],

    /*
     * Currency
     */
    'currency' => 'TZS',  // Tanzanian Shilling

    /*
     * Fee payment threshold for exam card
     */
    'exam_card_min_payment_percent' => env('EXAM_CARD_MIN_PAYMENT', 50),
];
```

### 1.3 Create GePG Service

Create `app/Services/GePGService.php`:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GePGService
{
    /**
     * Generate a GePG Control Number for a bill (invoice).
     *
     * Required fields:
     * - BillId (unique reference)
     * - SubSpCode
     * - SpCode
     * - PymtId (student identifier, e.g., registration number)
     * - BillAmt (amount in TZS)
     * - BillExprDt (expiry date)
     * - PayerName
     * - PayerEmail
     * - PayerPhone (used by GePG to send control number via SMS)
     * - BillDesc (fee description)
     * - BillGenDt (generation date)
     * - BillGenBy (system user)
     * - BillApprBy (approver)
     * - BillEqvAmt (equivalent amount, same as BillAmt)
     * - BillPayerFrd (payer reference)
     *
     * @param array $billData
     * @return array{control_number: string, bill_id: string}
     * @throws GePGException
     */
    public function generateControlNumber(array $billData): array;

    /**
     * Verify payment status with GePG.
     *
     * Called by the payment confirmation callback from GePG.
     *
     * @param string $controlNumber
     * @return array{paid: bool, amount: float, trx_id: string, paid_at: string}
     */
    public function verifyPayment(string $controlNumber): array;

    /**
     * Cancel/void a control number (e.g., when invoice is adjusted).
     */
    public function cancelControlNumber(string $controlNumber): bool;

    /**
     * Reconcile payments for a given date range.
     * Used for bulk end-of-day reconciliation.
     */
    public function reconcilePayments(string $startDate, string $endDate): array;

    /**
     * Build XML request payload for GePG bill submission.
     * GePG API uses SOAP/XML format for bill submission.
     */
    private function buildBillSubmissionXml(array $billData): string;

    /**
     * Sign the request payload with institution's RSA private key.
     */
    private function signRequest(string $payload): string;

    /**
     * Verify GePG callback signature using GePG's public key.
     */
    private function verifyCallbackSignature(string $payload, string $signature): bool;
}
```

### 1.4 GePG Control Number Lifecycle

```
Invoice Created (FeeController@store)
  → Status: 'pending'
  → GePGService::generateControlNumber() called
  → GePG responds with Control Number (e.g., 991234567890)
  → Invoice updated: control_number = '991234567890', status = 'awaiting_payment'
  → SMS sent to student: "Your fee control number 991234567890 for TZS 1,200,000 is valid until 2026-07-13. Pay via CRDB/NMB/M-Pesa."
  → Cache control number in Redis with TTL (expiry date)

Student pays (via bank/mobile)
  → GePG sends payment callback to /api/gepg/payment-callback
  → GePGService::verifyPayment() validates callback signature
  → Payment recorded in payments table
  → Invoice updated: status = 'paid', paid_at = now()
  → Student account credited
  → If fee payment >= 50%, exam card block automatically removed
  → Real-time notification sent to student via WebSocket

Control Number expires (no payment received)
  → Scheduled job runs daily: CancelExpiredControlNumbersJob
  → Invoice status = 'expired'
  → Student notified to request new control number
```

### 1.5 Create GePG Webhook Controller

Create `app/Http/Controllers/Api/GePGController.php`:

```php
class GePGController extends Controller
{
    /**
     * POST /api/gepg/payment-callback
     *
     * GePG sends payment confirmation to this endpoint.
     * Request is signed with GePG's RSA private key.
     *
     * @throws \App\Exceptions\GePGSignatureException
     */
    public function paymentCallback(Request $request): JsonResponse
    {
        // 1. Verify signature using GePG public key
        // 2. Extract payment details (control number, amount, trx_id, timestamp)
        // 3. Find matching invoice by control number
        // 4. Create Payment record
        // 5. Update invoice status
        // 6. Trigger exam card unblock if threshold met
        // 7. Return GePG acknowledgment XML
    }

    /**
     * POST /api/gepg/payment-reconciliation
     *
     * End-of-day reconciliation request from GePG.
     */
    public function reconciliationCallback(Request $request): JsonResponse
    {
        // 1. Verify signature
        // 2. Process batch payment records
        // 3. Generate reconciliation report
        // 4. Return acknowledgment
    }
}
```

### 1.6 Create Student-Facing Fee Portal

Enhance existing `FeeController@index` to expose:

```
GET /student/fees
  → Current semester fees breakdown
  → Control number (if generated)
  → Payment history
  → Payment percentage + exam card status (blocked/unblocked)
  → "Request New Control Number" button (if expired)
```

---

## Phase 2: HESLB Integration

### 2.1 Understanding HESLB (Higher Education Students' Loans Board)

HESLB provides government loans to Tanzanian university students. Loan components:

- **Tuition Fee**: Paid directly to institution
- **Meals & Accommodation**: Paid to institution, disbursed to student monthly
- **Books & Stationery**: Paid to student directly

### 2.2 HESLB Data Model

```php
// New table: heslb_allocations
Schema::create('heslb_allocations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('student_id')->constrained();
    $table->string('heslb_ref_number')->unique();       // HESLB-assigned reference
    $table->string('academic_year');                     // e.g., "2025/2026"
    $table->decimal('tuition_amount', 12, 2)->default(0);
    $table->decimal('meals_amount', 12, 2)->default(0);
    $table->decimal('accommodation_amount', 12, 2)->default(0);
    $table->decimal('books_amount', 12, 2)->default(0);
    $table->decimal('total_amount', 12, 2)->default(0);
    $table->enum('disbursement_status', ['pending', 'partial', 'completed'])->default('pending');
    $table->timestamp('last_disbursement_at')->nullable();
    $table->timestamps();
});
```

### 2.3 HESLB Disbursement Logic

```
Before each semester:
  1. System receives HESLB allocation file (CSV/API)
  2. Matches students by registration_number or HESLB ref
  3. Creates/updates heslb_allocations record
  4. Creates tuition_invoice for the tuition portion
  5. Scheduled job: MonthlyDisbursementJob
     → Disburses meals_amount to student meals account
     → Disburses accommodation to hostel account
     → Generates disbursement record
     → Sends SMS notification to student
```

### 2.4 HESLB Matching (Controller)

Create `app/Http/Controllers/Api/HESLBController.php`:

```php
class HESLBController extends Controller
{
    /**
     * POST /api/heslb/allocate
     *
     * Receive bulk allocation data from HESLB.
     * Expects CSV/JSON with: heslb_ref, student_reg, tuition, meals, accommodation, books
     */
    public function allocate(Request $request): JsonResponse;

    /**
     * GET /api/heslb/disbursement-report
     *
     * Generate disbursement report for HESLB submission.
     */
    public function disbursementReport(Request $request): JsonResponse;
}
```

---

## Phase 3: Automated Fee Block/Unblock System

### 3.1 Create Service

Create `app/Services/FeeBlockingService.php`:

```php
class FeeBlockingService
{
    /**
     * Check if student is blocked from exam card generation.
     *
     * @return array{blocked: bool, reason: ?string, payment_percentage: float}
     */
    public function checkExamCardStatus(Student $student): array
    {
        $totalFee = TuitionInvoice::where('student_id', $student->id)
            ->where('academic_year', $this->getCurrentAcademicYear())
            ->sum('amount');

        $totalPaid = Payment::where('student_id', $student->id)
            ->where('academic_year', $this->getCurrentAcademicYear())
            ->sum('amount');

        $percentage = $totalFee > 0 ? round(($totalPaid / $totalFee) * 100, 2) : 0;

        return [
            'blocked' => $percentage < config('gepg.exam_card_min_payment_percent'),
            'reason' => $percentage < config('gepg.exam_card_min_payment_percent')
                ? "Payment at {$percentage}% — minimum 50% required"
                : null,
            'payment_percentage' => $percentage,
        ];
    }

    /**
     * Automatically unblock student when payment threshold is met.
     * Called after GePG payment callback.
     */
    public function attemptUnblock(Student $student): void;
}
```

### 3.2 Exam Card Generation Lock

Add middleware or gate check:

```php
// In ExamController@index or a dedicated exam card endpoint:
$status = app(FeeBlockingService::class)->checkExamCardStatus($student);
if ($status['blocked']) {
    return back()->with('error', "Exam card blocked: {$status['reason']}");
}
// Proceed with exam card generation
```

---

## Phase 4: Financial Dashboards

### 4.1 Controller Enhancement

Add to `PaymentController@index`:

```php
$stats = [
    'total_collected' => Payment::where(...)->sum('amount'),
    'pending_invoices' => TuitionInvoice::where('status', 'awaiting_payment')->count(),
    'pending_amount' => TuitionInvoice::where('status', 'awaiting_payment')->sum('amount'),
    'overdue_amount' => TuitionInvoice::where('status', 'awaiting_payment')
        ->where('due_at', '<', now())
        ->sum('amount'),
    'collection_rate' => $totalFee > 0 ? round(($totalPaid / $totalFee) * 100, 2) : 0,
    'by_program' => TuitionInvoice::selectRaw('programs.name, sum(amount) as total')
        ->join('students', 'tuition_invoices.student_id', '=', 'students.id')
        ->join('programs', 'students.program_id', '=', 'programs.id')
        ->groupBy('programs.name')
        ->get(),
    'monthly_collections' => Payment::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, sum(amount) as total")
        ->groupBy('month')
        ->orderBy('month')
        ->get(),
];
```

### 4.2 Dashboard Components

Create or enhance:

- `resources/js/components/finance/collection-dashboard.tsx` — Collection stats with Recharts
- `resources/js/components/finance/pending-alerts.tsx` — Overdue payment alerts
- `resources/js/components/finance/payment-timeline.tsx` — Student payment timeline (exists)

### 4.3 Wire View Toggle

Add grid/table toggle to `admin/finances/payments/index.tsx` following the same pattern as students/attendance.

---

## Phase 5: Migration Plan

| Step | Description                       | Files                                         |
| ---- | --------------------------------- | --------------------------------------------- |
| 1    | Create GePG config                | `config/gepg.php`                             |
| 2    | Create GePGService                | `app/Services/GePGService.php`                |
| 3    | Create GePGController             | `app/Http/Controllers/Api/GePGController.php` |
| 4    | Create HESLB allocation migration | New migration                                 |
| 5    | Create HESLB model & controller   | `app/Models/HESLBAllocation.php` + Controller |
| 6    | Create FeeBlockingService         | `app/Services/FeeBlockingService.php`         |
| 7    | Create GePG routes                | `routes/api.php`                              |
| 8    | Create HESLB routes               | `routes/api.php`                              |
| 9    | Add exam card middleware          | Middleware or gate                            |
| 10   | Create FinanceDashboard component | New component                                 |
| 11   | Wire finance view toggle          | Update payments index page                    |
| 12   | Create SMS notification           | Use Africa's Talking / InfoBip for SMS        |
