<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['financial_account_id', 'invoice_number', 'total_amount', 'due_date', 'status'])]
class TuitionInvoice extends Model
{
    public function financialAccount(): BelongsTo
    {
        return $this->belongsTo(FinancialAccount::class);
    }

    public function invoiceLineItems(): HasMany
    {
        return $this->hasMany(InvoiceLineItem::class);
    }
}
