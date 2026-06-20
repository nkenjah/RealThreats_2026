import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface Application {
    id: number;
    prospect?: { first_name: string; last_name: string };
}
interface Offer {
    id: number;
    application_id: number;
    offer_date: string;
    decision_deadline: string;
    tuition_fee: number;
    status: string;
    responded_at: string | null;
}

interface Props {
    admissionOffer: Offer;
    applications: Application[];
}

export default function OffersEdit({ admissionOffer, applications }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        application_id: String(admissionOffer.application_id),
        offer_date: admissionOffer.offer_date.slice(0, 10),
        decision_deadline: admissionOffer.decision_deadline.slice(0, 10),
        tuition_fee: String(admissionOffer.tuition_fee),
        status: admissionOffer.status,
        responded_at: admissionOffer.responded_at
            ? admissionOffer.responded_at.slice(0, 10)
            : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/admissions/offers/${admissionOffer.id}`);
    };

    return (
        <>
            <Head title="Edit Offer" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/admissions/offers">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Admission Offer</h1>
                </div>
                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="application_id">Application</Label>
                            <Select
                                value={data.application_id}
                                onValueChange={(v) =>
                                    setData('application_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select application" />
                                </SelectTrigger>
                                <SelectContent>
                                    {applications.map((a) => (
                                        <SelectItem
                                            key={a.id}
                                            value={String(a.id)}
                                        >
                                            App #{a.id} -{' '}
                                            {a.prospect?.first_name}{' '}
                                            {a.prospect?.last_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.application_id && (
                                <p className="text-sm text-destructive">
                                    {errors.application_id}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="offer_date">Offer Date</Label>
                            <Input
                                id="offer_date"
                                type="date"
                                value={data.offer_date}
                                onChange={(e) =>
                                    setData('offer_date', e.target.value)
                                }
                            />
                            {errors.offer_date && (
                                <p className="text-sm text-destructive">
                                    {errors.offer_date}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="decision_deadline">
                                Decision Deadline
                            </Label>
                            <Input
                                id="decision_deadline"
                                type="date"
                                value={data.decision_deadline}
                                onChange={(e) =>
                                    setData('decision_deadline', e.target.value)
                                }
                            />
                            {errors.decision_deadline && (
                                <p className="text-sm text-destructive">
                                    {errors.decision_deadline}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tuition_fee">Tuition Fee</Label>
                            <Input
                                id="tuition_fee"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.tuition_fee}
                                onChange={(e) =>
                                    setData('tuition_fee', e.target.value)
                                }
                            />
                            {errors.tuition_fee && (
                                <p className="text-sm text-destructive">
                                    {errors.tuition_fee}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) => setData('status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="accepted">
                                        Accepted
                                    </SelectItem>
                                    <SelectItem value="declined">
                                        Declined
                                    </SelectItem>
                                    <SelectItem value="expired">
                                        Expired
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="responded_at">Responded At</Label>
                            <Input
                                id="responded_at"
                                type="date"
                                value={data.responded_at}
                                onChange={(e) =>
                                    setData('responded_at', e.target.value)
                                }
                            />
                            {errors.responded_at && (
                                <p className="text-sm text-destructive">
                                    {errors.responded_at}
                                </p>
                            )}
                        </div>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Offer'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

OffersEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admissions', href: '/admin/admissions/offers' },
        { title: 'Edit Offer', href: '' },
    ],
};
