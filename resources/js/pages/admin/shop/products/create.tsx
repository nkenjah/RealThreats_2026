import { Head, Link, useForm } from '@inertiajs/react';
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
import { Textarea } from '@/components/ui/textarea';

export default function ShopProductsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        category: '',
        sku: '',
        stock_quantity: '0',
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/shop/products');
    };

    return (
        <>
            <Head title="Add Product" />
            <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/admin/shop/products">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Add Product</h1>
                        <p className="text-sm text-muted-foreground">
                            Create a new e-shop product
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-lg border p-6"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={3}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="price">Price (TZS)</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                value={data.price}
                                onChange={(e) =>
                                    setData('price', e.target.value)
                                }
                            />
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="stock_quantity">
                                Stock Quantity
                            </Label>
                            <Input
                                id="stock_quantity"
                                type="number"
                                min="0"
                                value={data.stock_quantity}
                                onChange={(e) =>
                                    setData('stock_quantity', e.target.value)
                                }
                            />
                            {errors.stock_quantity && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.stock_quantity}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="sku">SKU (optional)</Label>
                            <Input
                                id="sku"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                            />
                            {errors.sku && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.sku}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="category">
                                Category (optional)
                            </Label>
                            <Input
                                id="category"
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                            />
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Status</Label>
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
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href="/admin/shop/products">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button disabled={processing}>Create Product</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
