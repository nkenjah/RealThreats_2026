import { Link } from '@inertiajs/react';

interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: {
        data: T[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    columns: Column<T>[];
    filters?: Record<string, string | undefined>;
    searchPlaceholder?: string;
    filterFields?: React.ReactNode;
}

export default function DataTable<T extends Record<string, any>>({
    data,
    columns,
    filters = {},
    searchPlaceholder = 'Search...',
    filterFields,
}: DataTableProps<T>) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-4">
                    <input
                        name="search"
                        defaultValue={filters.search}
                        placeholder={searchPlaceholder}
                        className="h-9 w-full max-w-sm rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                        onChange={(e) => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('search', e.target.value);
                            url.searchParams.set('page', '1');
                            window.location.href = url.toString();
                        }}
                    />
                    {filterFields}
                </div>
                <div className="text-sm text-muted-foreground">
                    {data.total} total records
                </div>
            </div>

            <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3 text-left font-medium text-muted-foreground"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.map((item, i) => (
                            <tr
                                key={item.id ?? i}
                                className="border-b transition-colors last:border-0 hover:bg-muted/30"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3">
                                        {col.render
                                            ? col.render(item)
                                            : String(item[col.key] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-12 text-center text-muted-foreground"
                                >
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {data.last_page > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {data.from} to {data.to} of {data.total}
                    </div>
                    <div className="flex items-center gap-1">
                        {data.links.map((link, i) => {
                            if (!link.url) {
                                return (
                                    <span
                                        key={i}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded text-sm text-muted-foreground"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            }
                            return (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`inline-flex h-8 w-8 items-center justify-center rounded text-sm transition-colors ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-muted'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
