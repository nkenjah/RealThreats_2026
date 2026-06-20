import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';

export default function ScratchCardsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        count: '100',
        value: '',
        expires_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/scratch-cards');
    };

    return (
        <>
            <Head title="Generate Scratch Cards" />
            <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/admin/scratch-cards">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Generate Scratch Cards
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create a batch of payment scratch cards
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-lg border p-6"
                >
                    <div>
                        <Label htmlFor="count">Number of Cards</Label>
                        <Input
                            id="count"
                            type="number"
                            min="1"
                            max="1000"
                            value={data.count}
                            onChange={(e) => setData('count', e.target.value)}
                        />
                        {errors.count && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.count}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="value">Card Value (TZS)</Label>
                        <Input
                            id="value"
                            type="number"
                            min="1000"
                            step="500"
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                        />
                        {errors.value && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.value}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="expires_at">
                            Expiry Date (optional)
                        </Label>
                        <Input
                            id="expires_at"
                            type="date"
                            value={data.expires_at}
                            onChange={(e) =>
                                setData('expires_at', e.target.value)
                            }
                        />
                        {errors.expires_at && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.expires_at}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href="/admin/scratch-cards">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button disabled={processing}>Generate Cards</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
