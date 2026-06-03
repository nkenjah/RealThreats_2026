<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('threats', fn () => true);

Broadcast::channel('admin-alerts', fn ($user) => $user->hasRole(['admin', 'superadmin']));

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
