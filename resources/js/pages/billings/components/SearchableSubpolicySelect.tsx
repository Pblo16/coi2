import { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubpolicyOption {
    id: number | string;
    name: string;
    policy?: {
        id: number | string;
        name: string;
    };
    displayName?: string; // For formatted display
}

interface SearchableSubpolicySelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SubpolicyOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function SearchableSubpolicySelect({
    value,
    onChange,
    options,
    placeholder = "Select a subpolicy",
    disabled = false,
    className,
}: SearchableSubpolicySelectProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [formattedOptions, setFormattedOptions] = useState<SubpolicyOption[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Format options to include parent policy in display name
    useEffect(() => {
        const formatted = options.map(option => ({
            ...option,
            displayName: option.policy
                ? `${option.policy.name}-${option.name}`
                : option.name
        }));
        setFormattedOptions(formatted);
    }, [options]);

    // Update popup position when it's opened
    useEffect(() => {
        if (!open) return;

        // Add the dropdown to the document body to avoid overflow issues
        const renderDropdownPortal = () => {
            if (!buttonRef.current || !dropdownRef.current) return;

            const buttonRect = buttonRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Position the dropdown
            dropdownRef.current.style.position = 'fixed';
            dropdownRef.current.style.top = `${buttonRect.bottom}px`;
            dropdownRef.current.style.left = `${buttonRect.left}px`;
            dropdownRef.current.style.width = `${buttonRect.width}px`;
            dropdownRef.current.style.zIndex = '9999';

            // Check if there's enough space below the button
            const dropdownHeight = dropdownRef.current.offsetHeight;
            const spaceBelow = viewportHeight - buttonRect.bottom;

            // If not enough space below, position above
            if (dropdownHeight > spaceBelow && buttonRect.top > dropdownHeight) {
                dropdownRef.current.style.top = `${buttonRect.top - dropdownHeight}px`;
            }
        };

        renderDropdownPortal();

        // Update position on scroll or resize
        const handleScroll = () => renderDropdownPortal();
        const handleResize = () => renderDropdownPortal();

        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [open]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Filter options based on search term
    const filteredOptions = searchTerm
        ? formattedOptions.filter(option =>
            option.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 10) // Limit to 10 results when searching
        : formattedOptions.slice(0, 10); // Limit to 10 results when not searching

    // Find the selected option
    const selectedOption = formattedOptions.find(option => option.id.toString() === value?.toString());
    const displayValue = selectedOption?.displayName || placeholder;

    return (
        <div ref={containerRef} className="relative">
            <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                disabled={disabled}
                className={cn("w-full justify-between text-left font-normal", className)}
                onClick={() => setOpen(!open)}
                ref={buttonRef}
            >
                <span className="truncate">{displayValue}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                // Portal container at document body level
                <div
                    ref={dropdownRef}
                    className="fixed bg-background border rounded-md shadow-lg"
                    style={{
                        position: 'fixed',
                        zIndex: 9999
                    }}
                >
                    <div className="p-2">
                        <div className="flex items-center border-b px-3 mb-2">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <Input
                                className="flex h-9 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="Search subpolicies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {filteredOptions.length === 0 && (
                                <div className="py-6 text-center text-sm">No subpolicies found.</div>
                            )}
                            <div className="overflow-hidden p-1">
                                {filteredOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        className={cn(
                                            "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                            value === option.id.toString() ? "bg-accent text-accent-foreground" : ""
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChange(option.id.toString());
                                            setOpen(false);
                                            setSearchTerm("");
                                        }}
                                    >
                                        <div className="flex items-center w-full">
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === option.id.toString() ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="truncate">{option.name}</span>
                                                {option.policy && (
                                                    <span className="text-xs text-muted-foreground truncate">
                                                        {option.policy.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
