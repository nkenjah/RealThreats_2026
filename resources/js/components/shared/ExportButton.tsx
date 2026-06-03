import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ExportButtonProps {
    href: string;
    label?: string;
}

export default function ExportButton({
    href,
    label = 'Export CSV',
}: ExportButtonProps) {
    return (
        <Button variant="outline" size="sm" asChild>
            <a href={href}>
                <Download className="mr-2 h-4 w-4" />
                {label}
            </a>
        </Button>
    );
}
