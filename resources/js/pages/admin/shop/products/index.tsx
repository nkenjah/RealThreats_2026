import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Product {
    id: number;
    name: string;
    sku: string | null;
    price: number;
    category: string | null;
    stock_quantity: number;
    status: string;
}

interface Props {
    products: any;
    filters: Record<string, string | undefined>;
    categories: string[];
}

export default function ShopProductsIndex({
    products,
    filters,
    categories,
}: Props) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (p: Product) => (
                <span className="font-medium">{p.name}</span>
            ),
        },
        { key: 'sku', label: 'SKU', render: (p: Product) => p.sku ?? '—' },
        {
            key: 'price',
            label: 'Price',
            render: (p: Product) =>
                new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: 'TZS',
                }).format(p.price),
        },
        {
            key: 'category',
            label: 'Category',
            render: (p: Product) => p.category ?? '—',
        },
        {
            key: 'stock_quantity',
            label: 'Stock',
            render: (p: Product) => (
                <span
                    className={
                        p.stock_quantity === 0 ? 'font-medium text-red-500' : ''
                    }
                >
                    {p.stock_quantity}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (p: Product) => {
                const colors: Record<string, string> = {
                    active: 'text-green-600 bg-green-50',
                    inactive: 'text-gray-600 bg-gray-100',
                };
                return (
                    <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[p.status] || ''}`}
                    >
                        {p.status}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: '',
            render: (p: Product) => (
                <Link
                    href={`/admin/shop/products/${p.id}/edit`}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Edit
                </Link>
            ),
        },
    ];

    return (
        <>
            <Head title="Shop Products" />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Shop Products</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage school e-shop merchandise
                    </p>
                </div>
                <Link href="/admin/shop/products/create">
                    <Button>
                        <Plus className="mr-2 size-4" /> Add Product
                    </Button>
                </Link>
            </div>
            <DataTable
                columns={columns}
                data={products}
                filters={filters}
                filterKeys={['search', 'status']}
                searchPlaceholder="Search by name or SKU..."
            />
        </>
    );
}
