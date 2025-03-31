import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'thread-ui';

interface DropdownProps {
    label?: string;
    value: string | number;
    options: DropdownOption[];
    onSelect: (value: string | number) => void;
}

interface DropdownOption {
    label: string;
    value: string | number;
}

export const Dropdown = ({ label, value, options, onSelect }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<DropdownOption>(() => {
        // Find option matching the provided value or default to first option
        const matchingOption = options.find((option) => option.value === value);
        return matchingOption || options[0];
    });
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Update selected option when value prop changes
    useEffect(() => {
        const matchingOption = options.find((option) => option.value === value);
        if (matchingOption) {
            setSelected(matchingOption);
        }
    }, [value, options]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (option: DropdownOption) => {
        setSelected(option);
        onSelect(option.value);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full relative" ref={dropdownRef}>
            {label && <div className="block font-medium text-gray-700 mb-2">{label}</div>}
            <button
                className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 rounded-lg shadow-sm focus:outline-none"
                onClick={toggleDropdown}
            >
                <span>{selected.label}</span>
                <Icon name={isOpen ? 'CaretUp' : 'CaretDown'} size={16} color="black" />
            </button>
            {isOpen && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10 max-h-60 overflow-auto">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${option.value === selected.value ? 'bg-gray-50' : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
