import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface DebugDataProps {
    data: any;
    title?: string;
}

export default function DebugData({ data, title = 'Debug Data' }: DebugDataProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="my-4 p-3 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-mono">{title}</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? 'Hide' : 'Show'} Details
                </Button>
            </div>

            {isOpen && (
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
}
