<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>General Ledger</title>
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

        .policy-group {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .total-row {
            font-weight: bold;
            background-color: #f0f0f0;
        }

        .policy-header {
            background-color: #e9e9e9;
            padding: 5px;
            margin-top: 15px;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="header clearfix">
        <div class="company-info">
            <h1>{{ config('app.name') }}</h1>
            <p>General Ledger (Balanza General)</p>
        </div>
        <div class="document-info">
            <p><strong>Date:</strong> {{ $date }}</p>
            <p><strong>Period:</strong> {{ $startDate }} to {{ $endDate }}</p>
            <p><strong>Policy:</strong> {{ $policyName }}</p>
        </div>
    </div>

    <h2>General Ledger Report</h2>

    @php
    $currentPolicyId = null;
    $policyTotals = [
    'debit' => 0,
    'credit' => 0,
    'balance' => 0
    ];
    @endphp

    <table>
        <thead>
            <tr>
                <th>Account Code</th>
                <th>Account Name</th>
                <th style="text-align:right">Debit</th>
                <th style="text-align:right">Credit</th>
                <th style="text-align:right">Balance</th>
            </tr>
        </thead>
        <tbody>
            @forelse($accounts as $account)
            @if($currentPolicyId !== $account->policy_id)
            @if($currentPolicyId !== null)
            <tr class="total-row">
                <td colspan="2">Total for {{ $prevPolicyName }}</td>
                <td class="amount">{{ number_format($policyTotals['debit'], 2) }}</td>
                <td class="amount">{{ number_format($policyTotals['credit'], 2) }}</td>
                <td class="amount">{{ number_format($policyTotals['balance'], 2) }}</td>
            </tr>
            @endif
            @php
            $currentPolicyId = $account->policy_id;
            $prevPolicyName = $account->policy_name;
            $policyTotals = [
            'debit' => 0,
            'credit' => 0,
            'balance' => 0
            ];
            @endphp
            <tr>
                <td colspan="5" class="policy-header">
                    {{ $account->policy_code }} - {{ $account->policy_name }}
                </td>
            </tr>
            @endif
            <tr>
                <td>{{ $account->policy_code }}</td>
                <td>{{ $account->subpolicy_name }}</td>
                <td class="amount">{{ number_format($account->debit_total, 2) }}</td>
                <td class="amount">{{ number_format($account->credit_total, 2) }}</td>
                <td class="amount">{{ number_format($account->balance, 2) }}</td>
            </tr>
            @php
            $policyTotals['debit'] += $account->debit_total;
            $policyTotals['credit'] += $account->credit_total;
            $policyTotals['balance'] += $account->balance;
            @endphp
            @empty
            <tr>
                <td colspan="5" style="text-align: center">No account data found for the selected period</td>
            </tr>
            @endforelse

            @if($currentPolicyId !== null)
            <tr class="total-row">
                <td colspan="2">Total for {{ $prevPolicyName }}</td>
                <td class="amount">{{ number_format($policyTotals['debit'], 2) }}</td>
                <td class="amount">{{ number_format($policyTotals['credit'], 2) }}</td>
                <td class="amount">{{ number_format($policyTotals['balance'], 2) }}</td>
            </tr>
            @endif
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="2">Grand Total</td>
                <td class="amount">{{ number_format($totalDebits, 2) }}</td>
                <td class="amount">{{ number_format($totalCredits, 2) }}</td>
                <td class="amount">{{ number_format($totalDebits - $totalCredits, 2) }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p>Generated on {{ $date }} by {{ config('app.name') }}</p>
        <p>This is an automatically generated document.</p>
    </div>
</body>

</html>