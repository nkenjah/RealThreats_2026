<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['tuition_invoice_id', 'description', 'amount'])]
class InvoiceLineItem extends Model
{
    public function tuitionInvoice(): BelongsTo
    {
        return $this->belongsTo(TuitionInvoice::class);
    }
}
