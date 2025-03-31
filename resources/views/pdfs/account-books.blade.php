<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Books</title>
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

        h3 {
            font-size: 14px;
            margin: 15px 0 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 10px;
        }

        th,
        td {
            text-align: left;
            padding: 6px;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f8f8f8;
            font-weight: bold;
        }

        .summary {
            margin-top: 20px;
        }

        .amount {
            text-align: right;
        }

        .footer {
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 15px;
            text-align: center;
            font-size: 10px;
            color: #777;
        }

        .account-info {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
        }

        .total-row {
            font-weight: bold;
            background-color: #f0f0f0;
        }
    </style>
</head>

<body>
    <div class="header clearfix">
        <div class="company-info">
            <h1>{{ config('app.name') }}</h1>
            <p>Account Books (Libro Mayor)</p>
        </div>
        <div class="document-info">
            <p><strong>Date:</strong> {{ $date }}</p>
            <p><strong>Period:</strong> {{ $startDate }} to {{ $endDate }}</p>
        </div>
    </div>

    <div class="account-info">
        <h3>Account Information</h3>
        <p><strong>Account:</strong>
            @if($subpolicy->policy)
            {{ $subpolicy->policy->code ?? 'No code' }} - {{ $subpolicy->policy->name }} / {{ $subpolicy->name }}
            @else
            {{ $subpolicy->name }}
            @endif
        </p>
        <p><strong>Final Balance:</strong> {{ number_format($finalBalance, 2) }}</p>
    </div>

    <h2>Transaction History</h2>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Description</th>
                <th style="text-align:right">Debit</th>
                <th style="text-align:right">Credit</th>
                <th style="text-align:right">Balance</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transactions as $transaction)
            <tr>
                <td>{{ $transaction['date'] }}</td>
                <td>{{ $transaction['billing_id'] }}</td>
                <td>{{ $transaction['details'] }}</td>
                <td class="amount">
                    @if($transaction['debit'] > 0)
                    {{ number_format($transaction['debit'], 2) }}
                    @endif
                </td>
                <td class="amount">
                    @if($transaction['credit'] > 0)
                    {{ number_format($transaction['credit'], 2) }}
                    @endif
                </td>
                <td class="amount">{{ number_format($transaction['balance'], 2) }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center">No transactions found for this account in the selected period
                </td>
            </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="3">Totals</td>
                <td class="amount">{{ number_format($totalDebits, 2) }}</td>
                <td class="amount">{{ number_format($totalCredits, 2) }}</td>
                <td class="amount">{{ number_format($finalBalance, 2) }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p>Generated on {{ $date }} by {{ config('app.name') }}</p>
        <p>This is an automatically generated document.</p>
    </div>
</body>

</html>