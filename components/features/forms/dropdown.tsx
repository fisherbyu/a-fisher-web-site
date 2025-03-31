import React, { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { Icon } from 'thread-ui';

interface DropdownProps {
    label: string;
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
    const [selected, setSelected] = useState(options[0]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (option: DropdownOption) => {
        setSelected(option);
        onSelect(option.value);
        setIsOpen(false);
    };

    return (
        <div className="w-full">
            <div className="block font-medium text-gray-700 ">{label}</div>
            <button
                className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 rounded-lg shadow-sm focus:outline-none"
                onClick={toggleDropdown}
            >
                <span>{selected.label}</span>
                {isOpen ? <Icon name="CaretUp" size={16} color="black" /> : <Icon name="CaretDown" size={16} color="black" />}
            </button>
            {isOpen && (
                <ul className=" w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                    {options.map((option, index) => (
                        <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelect(option)}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
