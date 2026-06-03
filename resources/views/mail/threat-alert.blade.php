<h1>KIUT Threat Alert</h1>
<p><strong>Severity:</strong> {{ strtoupper($alert->severity) }}</p>
<p><strong>User:</strong> {{ $alert->user?->name }} ({{ $alert->user?->email }})</p>
<p><strong>Type:</strong> {{ str_replace('_', ' ', $alert->alert_type) }}</p>
<p>{{ $alert->notes }}</p>
