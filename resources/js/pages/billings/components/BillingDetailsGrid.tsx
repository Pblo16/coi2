import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface BillingDetail {
    id?: number;
    policy_id: number | string;
    amount: string | number;
    type: string | number;
    billing_id?: number;
    policy?: any;
}

interface BillingDetailsGridProps {
    billingDetails: BillingDetail[];
    onChange: (billingDetails: BillingDetail[]) => void;
    policies: any[];
}

// Transaction types - back to original two options
const TRANSACTION_TYPES = [
    { value: '0', label: 'Cargo (Debit)' },
    { value: '1', label: 'Abono (Credit)' },
];

export default function BillingDetailsGrid({ billingDetails, onChange, policies }: BillingDetailsGridProps) {
    const [billingDetailsList, setBillingDetailsList] = useState<BillingDetail[]>(
        billingDetails?.map(detail => ({
            ...detail,
            type: typeof detail.type === 'number' ? detail.type.toString() : detail.type
        })) || []
    );

    // Update internal state when billingDetails prop changes
    useEffect(() => {
        if (billingDetails && Array.isArray(billingDetails) && billingDetails.length > 0) {
            console.log('BillingDetailsGrid received details:', billingDetails);
            const formattedDetails = billingDetails.map(detail => ({
                ...detail,
                type: typeof detail.type === 'number' ? detail.type.toString() : detail.type
            }));
            setBillingDetailsList(formattedDetails);
        }
    }, [JSON.stringify(billingDetails)]);

    const addBillingDetail = () => {
        const newBillingDetails = [...billingDetailsList, { policy_id: '', amount: '', type: '0' }];
        setBillingDetailsList(newBillingDetails);
        onChange(newBillingDetails);
    };

    const updateBillingDetail = (index: number, field: keyof BillingDetail, value: any) => {
        const newBillingDetails = [...billingDetailsList];
        newBillingDetails[index][field] = value;
        setBillingDetailsList(newBillingDetails);
        onChange(newBillingDetails);
    };

    const removeBillingDetail = (index: number) => {
        const newBillingDetails = [...billingDetailsList];
        newBillingDetails.splice(index, 1);
        setBillingDetailsList(newBillingDetails);
        onChange(newBillingDetails);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                    Billing Details ({billingDetailsList.length})
                </h3>
                <Button type="button" onClick={addBillingDetail} size="sm">
                    Add Detail
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Policy</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {billingDetailsList.map((detail, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Select
                                    value={detail.policy_id.toString()}
                                    onValueChange={(value) => updateBillingDetail(index, 'policy_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Policy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {policies.map((policy) => (
                                            <SelectItem key={policy.id} value={policy.id.toString()}>
                                                {policy.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {detail.id && (
                                    <input type="hidden" name={`billingDetails[${index}][id]`} value={detail.id} />
                                )}
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={detail.amount}
                                    onChange={(e) => updateBillingDetail(index, 'amount', e.target.value)}
                                    placeholder="Amount"
                                />
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={detail.type.toString()}
                                    onValueChange={(value) => updateBillingDetail(index, 'type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TRANSACTION_TYPES.map(type => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeBillingDetail(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {billingDetailsList.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                No billing details added yet
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
