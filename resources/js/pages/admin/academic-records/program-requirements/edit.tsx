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

interface ProgramRequirement {
    id: number;
    program_id: number;
    name: string;
    type: string;
    credits_required: number;
}

interface Program {
    id: number;
    name: string;
}

interface Props {
    programRequirement: ProgramRequirement;
    programs: Program[];
}

export default function ProgramRequirementsEdit({
    programRequirement,
    programs,
}: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        program_id: String(programRequirement.program_id),
        name: programRequirement.name,
        type: programRequirement.type,
        credits_required: String(programRequirement.credits_required),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(
            `/admin/curriculum/program-requirements/${programRequirement.id}`,
        );
    };

    return (
        <>
            <Head title="Edit Program Requirement" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/curriculum/program-requirements">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">
                        Edit Program Requirement
                    </h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="program_id">Program</Label>
                            <Select
                                value={data.program_id}
                                onValueChange={(v) => setData('program_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map((p) => (
                                        <SelectItem
                                            key={p.id}
                                            value={String(p.id)}
                                        >
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.program_id && (
                                <p className="text-sm text-destructive">
                                    {errors.program_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={data.type}
                                onValueChange={(v) => setData('type', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="core">Core</SelectItem>
                                    <SelectItem value="elective">
                                        Elective
                                    </SelectItem>
                                    <SelectItem value="general_education">
                                        General Education
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-destructive">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="credits_required">
                                Credits Required
                            </Label>
                            <Input
                                id="credits_required"
                                type="number"
                                value={data.credits_required}
                                onChange={(e) =>
                                    setData('credits_required', e.target.value)
                                }
                            />
                            {errors.credits_required && (
                                <p className="text-sm text-destructive">
                                    {errors.credits_required}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Requirement'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

ProgramRequirementsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Program Requirements',
            href: '/admin/curriculum/program-requirements',
        },
        { title: 'Edit', href: '' },
    ],
};
