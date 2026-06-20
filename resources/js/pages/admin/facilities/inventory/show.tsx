import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { RoomInventory, Room } from '@/types';

interface Props {
    roomInventory: RoomInventory & {
        room: Room;
    };
}

export default function RoomInventoryShow({ roomInventory }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Inventory: ${roomInventory.item_name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/room-inventory">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {roomInventory.item_name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {roomInventory.room?.room_number ?? 'N/A'}
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDelete(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">Details</h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">ID</dt>
                            <dd>{roomInventory.id}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Item Name</dt>
                            <dd>{roomInventory.item_name}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Quantity</dt>
                            <dd>{roomInventory.quantity}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Condition</dt>
                            <dd className="capitalize">
                                {roomInventory.condition}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Room</dt>
                            <dd>{roomInventory.room?.room_number ?? 'N/A'}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/room-inventory/${roomInventory.id}`);
                    setShowDelete(false);
                }}
                title="Delete Inventory Item?"
                description="This will permanently delete this inventory item."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

RoomInventoryShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Facilities', href: '/admin/facilities' },
        { title: 'Room Inventory', href: '/admin/room-inventory' },
        { title: 'Inventory Details', href: '' },
    ],
};
