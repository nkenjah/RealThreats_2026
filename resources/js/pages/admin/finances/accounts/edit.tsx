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

interface Student {
    id: number;
    name: string;
    registration_number: string;
}
interface FinancialAccount {
    id: number;
    account_number: string;
    student_id: number;
    current_balance: number;
    status: string;
}

interface Props {
    financialAccount: FinancialAccount;
    students: Student[];
}

export default function AccountsEdit({ financialAccount, students }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: String(financialAccount.student_id),
        account_number: financialAccount.account_number,
        current_balance: String(financialAccount.current_balance),
        status: financialAccount.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/financial-accounts/${financialAccount.id}`);
    };

    return (
        <>
            <Head title={`Edit Account: ${financialAccount.account_number}`} />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/financial-accounts">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Account</h1>
                </div>
                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="student_id">Student</Label>
                            <Select
                                value={data.student_id}
                                onValueChange={(v) => setData('student_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((s) => (
                                        <SelectItem
                                            key={s.id}
                                            value={String(s.id)}
                                        >
                                            {s.name} ({s.registration_number})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.student_id && (
                                <p className="text-sm text-destructive">
                                    {errors.student_id}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="account_number">
                                Account Number
                            </Label>
                            <Input
                                id="account_number"
                                value={data.account_number}
                                onChange={(e) =>
                                    setData('account_number', e.target.value)
                                }
                            />
                            {errors.account_number && (
                                <p className="text-sm text-destructive">
                                    {errors.account_number}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="current_balance">Balance</Label>
                            <Input
                                id="current_balance"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.current_balance}
                                onChange={(e) =>
                                    setData('current_balance', e.target.value)
                                }
                            />
                            {errors.current_balance && (
                                <p className="text-sm text-destructive">
                                    {errors.current_balance}
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
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                    <SelectItem value="frozen">
                                        Frozen
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Account'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

AccountsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Finance', href: '/admin/financial-accounts' },
        { title: 'Edit Account', href: '' },
    ],
};
