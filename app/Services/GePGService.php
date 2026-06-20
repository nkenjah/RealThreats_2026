<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GePGService
{
    private string $environment;

    private string $baseUrl;

    private array $endpoints;

    public function __construct()
    {
        $this->environment = config('gepg.environment', 'sandbox');
        $this->endpoints = config("gepg.endpoints.{$this->environment}", []);
        $this->baseUrl = $this->endpoints['base'] ?? '';
    }

    /**
     * Generate a GePG Control Number for a bill.
     *
     * @param  array  $billData
     *                           Required keys: bill_id, payer_name, payer_phone, payer_email, amount, description
     * @return array{control_number: string, bill_id: string}
     */
    public function generateControlNumber(array $billData): array
    {
        $payload = $this->buildBillSubmissionXml($billData);
        $signature = $this->signRequest($payload);

        $response = Http::withHeaders([
            'Content-Type' => 'application/xml',
            'X-GePG-Signature' => $signature,
        ])->post($this->baseUrl.$this->endpoints['bill_submission'], $payload);

        return $this->parseControlNumberResponse($response->body());
    }

    /**
     * Verify payment status with GePG.
     */
    public function verifyPayment(string $controlNumber): array
    {
        $response = Http::get($this->baseUrl.$this->endpoints['payment_confirmation'], [
            'ControlNumber' => $controlNumber,
        ]);

        return $this->parsePaymentConfirmation($response->body());
    }

    /**
     * Cancel/void a control number.
     */
    public function cancelControlNumber(string $controlNumber): bool
    {
        $payload = "<CancelCtrlNumReq><ControlNumber>{$controlNumber}</ControlNumber></CancelCtrlNumReq>";
        $signature = $this->signRequest($payload);

        $response = Http::withHeaders([
            'Content-Type' => 'application/xml',
            'X-GePG-Signature' => $signature,
        ])->post($this->baseUrl.$this->endpoints['control_number_cancel'], $payload);

        return $response->successful();
    }

    /**
     * Reconcile payments for a date range.
     */
    public function reconcilePayments(string $startDate, string $endDate): array
    {
        $response = Http::get($this->baseUrl.$this->endpoints['payment_reconciliation'], [
            'StartDate' => $startDate,
            'EndDate' => $endDate,
        ]);

        return $response->json() ?? [];
    }

    /**
     * Verify GePG callback signature using GePG's public key.
     */
    public function verifyCallbackSignature(string $payload, string $signature): bool
    {
        $publicKey = $this->loadPublicKey();

        return openssl_verify($payload, base64_decode($signature), $publicKey, OPENSSL_ALGO_SHA256);
    }

    private function buildBillSubmissionXml(array $data): string
    {
        $subSpCode = $this->endpoints['sub_sp_code'] ?? config('gepg.sub_sp_code');
        $spCode = $this->endpoints['sp_code'] ?? config('gepg.sp_code');
        $expiryDate = $data['expiry_date'] ?? now()->addDays(config('gepg.control_number.expiry_days', 30))->format('Y-m-d');
        $genAt = $data['generated_at'] ?? now()->format('Y-m-d\TH:i:s');
        $genBy = $data['generated_by'] ?? 'SYSTEM';
        $apprBy = $data['approved_by'] ?? 'SYSTEM';
        $itemRef = $data['item_ref'] ?? '001';

        return <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<BillSubReq>
    <BillHdr>
        <SubSpCode>{$subSpCode}</SubSpCode>
        <SpCode>{$spCode}</SpCode>
        <BillId>{$data['bill_id']}</BillId>
        <BillAmt>{$data['amount']}</BillAmt>
        <BillExprDt>{$expiryDate}</BillExprDt>
        <PymtId>{$data['payer_id']}</PymtId>
        <BillDesc>{$data['description']}</BillDesc>
        <BillGenDt>{$genAt}</BillGenDt>
        <BillGenBy>{$genBy}</BillGenBy>
        <BillApprBy>{$apprBy}</BillApprBy>
        <PyrCellNum>{$data['payer_phone']}</PyrCellNum>
        <PyrEmail>{$data['payer_email']}</PyrEmail>
        <PyrName>{$data['payer_name']}</PyrName>
    </BillHdr>
    <BillItms>
        <BillItm>
            <BillItmRef>{$itemRef}</BillItmRef>
            <BillItmAmt>{$data['amount']}</BillItmAmt>
            <BillItmEqvAmt>{$data['amount']}</BillItmEqvAmt>
        </BillItm>
    </BillItms>
</BillSubReq>
XML;
    }

    private function signRequest(string $payload): string
    {
        $privateKey = $this->loadPrivateKey();
        $signature = '';
        openssl_sign($payload, $signature, $privateKey, OPENSSL_ALGO_SHA256);

        return base64_encode($signature);
    }

    private function loadPublicKey(): mixed
    {
        $path = config('gepg.certificates.public_key');

        return file_exists($path) ? openssl_get_publickey(file_get_contents($path)) : null;
    }

    private function loadPrivateKey(): mixed
    {
        $path = config('gepg.certificates.private_key');
        $passphrase = config('gepg.certificates.passphrase');
        if (! file_exists($path)) {
            return null;
        }

        return openssl_get_privatekey(file_get_contents($path), $passphrase);
    }

    private function parseControlNumberResponse(string $xml): array
    {
        // Parse GePG XML response
        $parsed = simplexml_load_string($xml);

        return [
            'control_number' => (string) ($parsed->BillSubResp->ControlNumber ?? ''),
            'bill_id' => (string) ($parsed->BillSubResp->BillId ?? ''),
        ];
    }

    private function parsePaymentConfirmation(string $xml): array
    {
        $parsed = simplexml_load_string($xml);

        return [
            'paid' => (string) ($parsed->PmtConfirmationResp->PaidStatus ?? '') === 'PAID',
            'amount' => (float) ($parsed->PmtConfirmationResp->PaidAmt ?? 0),
            'trx_id' => (string) ($parsed->PmtConfirmationResp->TrxId ?? ''),
            'paid_at' => (string) ($parsed->PmtConfirmationResp->TrxDtTm ?? ''),
        ];
    }
}
