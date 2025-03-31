import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { X } from 'lucide-react';

interface Subpolicy {
    id?: number;
    name: string;
    policy_id?: number;
}

interface SubpoliciesGridProps {
    subpolicies: Subpolicy[];
    onChange: (subpolicies: Subpolicy[]) => void;
}

export default function SubpoliciesGrid({ subpolicies, onChange }: SubpoliciesGridProps) {
    const [subpoliciesList, setSubpoliciesList] = useState<Subpolicy[]>(subpolicies || []);

    const addSubpolicy = () => {
        const newSubpolicies = [...subpoliciesList, { name: '' }];
        setSubpoliciesList(newSubpolicies);
        onChange(newSubpolicies);
    };

    const updateSubpolicy = (index: number, value: string) => {
        const newSubpolicies = [...subpoliciesList];
        newSubpolicies[index].name = value;
        setSubpoliciesList(newSubpolicies);
        onChange(newSubpolicies);
    };

    const removeSubpolicy = (index: number) => {
        const newSubpolicies = [...subpoliciesList];
        newSubpolicies.splice(index, 1);
        setSubpoliciesList(newSubpolicies);
        onChange(newSubpolicies);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Subpolicies</h3>
                <Button type="button" onClick={addSubpolicy} size="sm">
                    Add Subpolicy
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subpoliciesList.map((subpolicy, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Input
                                    value={subpolicy.name}
                                    onChange={(e) => updateSubpolicy(index, e.target.value)}
                                    placeholder="SubCuenta"
                                />
                                {subpolicy.id && (
                                    <input type="hidden" name={`subpolicies[${index}][id]`} value={subpolicy.id} />
                                )}
                            </TableCell>
                            <TableCell>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSubpolicy(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {subpoliciesList.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground">
                                No subpolicies added yet
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
