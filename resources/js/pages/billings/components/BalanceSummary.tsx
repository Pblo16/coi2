import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BillingDetail } from "../types";
import { calculateBalance, formatCurrency, isBalanced } from "../utils/calculations";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface BalanceSummaryProps {
    billingDetails: BillingDetail[];
}

export default function BalanceSummary({ billingDetails }: BalanceSummaryProps) {
    const balance = calculateBalance(billingDetails);
    const balanced = isBalanced(billingDetails);

    // If no details yet, don't show anything
    if (billingDetails.length === 0) {
        return null;
    }

    // Calculate totals for display
    const debits = billingDetails
        .filter(detail => detail.type === '0' || detail.type === 0)
        .reduce((sum, detail) => sum + (parseFloat(detail.amount as string) || 0), 0);

    const credits = billingDetails
        .filter(detail => detail.type === '1' || detail.type === 1)
        .reduce((sum, detail) => sum + (parseFloat(detail.amount as string) || 0), 0);

    return (
        <Alert variant={balanced ? "default" : "destructive"}>
            <div className="flex items-start gap-2">
                {balanced ? (
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-600" />
                ) : (
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                )}
                <div>
                    <AlertTitle>
                        {balanced ? "Balance correcto" : "Balance incorrecto"}
                    </AlertTitle>
                    <AlertDescription className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <div>
                                <span className="font-medium">Total cargos:</span> {formatCurrency(debits)}
                            </div>
                            <div>
                                <span className="font-medium">Total abonos:</span> {formatCurrency(credits)}
                            </div>
                        </div>
                        <div className="font-medium">
                            {balanced
                                ? "La cuenta está balanceada."
                                : `Diferencia: ${formatCurrency(balance)} (${balance > 0 ? 'falta abonar' : 'falta cargar'})`}
                        </div>
                    </AlertDescription>
                </div>
            </div>
        </Alert>
    );
}
