<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Billing List</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
        }

        .header {
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .company-info {
            float: left;
            width: 60%;
        }

        .document-info {
            float: right;
            width: 40%;
            text-align: right;
        }

        .clearfix:after {
            content: "";
            display: table;
            clear: both;
        }

        h1 {
            font-size: 18px;
            margin: 0 0 10px;
        }

        h2 {
            font-size: 16px;
            margin: 15px 0 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        th,
        td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f8f8f8;
        }

        .billing-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .amount {
            text-align: right;
        }

        .footer {
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 15px;
            text-align: center;
            font-size: 11px;
            color: #777;
        }
    </style>
</head>

<body>
    <div class="header clearfix">
        <div class="company-info">
            <h1>{{ config('app.name') }}</h1>
            <p>Billing List</p>
        </div>
        <div class="document-info">
            <p><strong>Date:</strong> {{ $date }}</p>
            <p><strong>Total Records:</strong> {{ $billings->count() }}</p>
        </div>
    </div>

    @forelse($billings as $billing)
    <div class="billing-section">
        <h2>Billing #{{ $billing->id }}</h2>
        <p><strong>Details:</strong> {{ $billing->details }}</p>
        <p><strong>Account Type:</strong> {{ $billing->account_type_text }}</p>
        <p><strong>Created:</strong> {{ $billing->created_at->format('d/m/Y H:i') }}</p>

        <table>
            <thead>
                <tr>
                    <th>Policy</th>
                    <th>Amount</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                @forelse($billing->billingDetails as $detail)
                <tr>
                    <td>
                        @if($detail->subpolicy && $detail->subpolicy->policy)
                        {{ $detail->subpolicy->policy->name }}-{{ $detail->subpolicy->name }}
                        @elseif($detail->subpolicy)
                        {{ $detail->subpolicy->name }}
                        @else
                        Unknown policy
                        @endif
                    </td>
                    <td class="amount">{{ number_format($detail->amount, 2) }}</td>
                    <td>{{ $detail->type_text }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="3" style="text-align: center">No billing details found</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="summary">
            <table>
                <tr>
                    <th>Total Debits (Cargos)</th>
                    <td class="amount">{{ number_format($billing->billingDetails->where('type', 0)->sum('amount'), 2) }}
                    </td>
                </tr>
                <tr>
                    <th>Total Credits (Abonos)</th>
                    <td class="amount">{{ number_format($billing->billingDetails->where('type', 1)->sum('amount'), 2) }}
                    </td>
                </tr>
            </table>
        </div>
    </div>
    @empty
    <p>No billings found</p>
    @endforelse

    <div class="footer">
        <p>Generated on {{ $date }} by {{ config('app.name') }}</p>
        <p>This is an automatically generated document.</p>
    </div>
</body>

</html>