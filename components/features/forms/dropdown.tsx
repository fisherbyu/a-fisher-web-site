import React, { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { Icon } from 'thread-ui';

interface DropdownProps {
    id: string;
    label: string;
    value: string | number;
    options: DropdownOption[];
    required?: boolean;
    onSelect: (value: string | number) => void;
}

interface DropdownOption {
    label: string;
    value: string | number;
}

export const Dropdown = ({ id, label, value, options, required, onSelect }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(options[0]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (option: DropdownOption) => {
        setSelected(option);
        onSelect(option.value);
        setIsOpen(false);
    };

    return (
        <div>
            <label htmlFor={id} className="block font-medium text-gray-700">
                {label}
            </label>
            <select
                id={id}
                name={id}
                required={required}
                value={value}
                className="w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg"
            >
                {options.map((option) => (
                    <option key={option.label} value={option.value} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
        // <div className="w-full">
        //     <button
        //         className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 rounded-lg shadow-sm focus:outline-none"
        //         onClick={toggleDropdown}
        //     >
        //         <span>{selected}</span>
        //         {isOpen ? <Icon name="CaretUp" size={16} color="black" /> : <Icon name="CaretDown" size={16} color="black" />}
        //     </button>
        //     {isOpen && (
        //         <ul className=" w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
        //             {options.map((option) => (
        //                 <li key={option} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelect(option)}>
        //                     {option}
        //                 </li>
        //             ))}
        //         </ul>
        //     )}
        // </div>
    );
};
