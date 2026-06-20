<?php

namespace App\Console\Commands;

use App\Models\LibraryBorrowing;
use App\Models\LibraryFine;
use Illuminate\Console\Command;

class CalculateOverdueFines extends Command
{
    protected $signature = 'library:calculate-overdue-fines
                            {--dry-run : Calculate without creating/updating fines}';

    protected $description = 'Calculate overdue fines for library borrowings';

    private const FINE_PER_DAY = 500;

    public function handle(): int
    {
        $overdue = LibraryBorrowing::whereNull('returned_at')
            ->where('due_at', '<', now())
            ->with('libraryFine')
            ->get();

        if ($overdue->isEmpty()) {
            $this->info('No overdue borrowings found.');

            return Command::SUCCESS;
        }

        $this->line("Found {$overdue->count()} overdue borrowing(s).");

        $created = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($overdue as $borrowing) {
            $daysOverdue = (int) now()->diffInDays($borrowing->due_at);
            $fineAmount = $daysOverdue * self::FINE_PER_DAY;

            if ($borrowing->libraryFine) {
                if ($borrowing->libraryFine->paid) {
                    $skipped++;

                    continue;
                }

                if (! $this->option('dry-run')) {
                    $borrowing->libraryFine->update(['amount' => $fineAmount]);
                }
                $updated++;
            } else {
                if (! $this->option('dry-run')) {
                    LibraryFine::create([
                        'library_borrowing_id' => $borrowing->id,
                        'amount' => $fineAmount,
                        'paid' => false,
                    ]);
                }
                $created++;
            }
        }

        $this->table(
            ['Action', 'Count'],
            [
                ['Created', $created],
                ['Updated', $updated],
                ['Skipped (paid)', $skipped],
            ],
        );

        if ($this->option('dry-run')) {
            $this->warn('Dry run — no changes persisted.');
        }

        return Command::SUCCESS;
    }
}
