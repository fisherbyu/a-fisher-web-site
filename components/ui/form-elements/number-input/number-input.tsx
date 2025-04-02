'use client';
import { Icon } from 'thread-ui';
import { FormLabel } from '../form-label';
import { InputWrapper } from '../input-wrapper';
import { NumberInputProps } from './number-input.types';
import { useState, useEffect } from 'react';

export const NumberInput = ({ name, id = name, title, value, placeholder, required, onChange, min }: NumberInputProps) => {
    // Initialize state with the value from props or null
    const [num, setNum] = useState<number | undefined>(value);

    // Update internal state when prop value changes
    useEffect(() => {
        setNum(value);
    }, [value]);

    // Correct increment handler
    const handleIncrement = (increment: number) => () => {
        const newValue = (num ?? 0) + increment;

        // Respect min value if provided
        if (min !== undefined && newValue < min) {
            return;
        }

        setNum(newValue);

        // Create a synthetic event to pass to onChange
        if (onChange) {
            const syntheticEvent = {
                target: {
                    name,
                    value: newValue,
                },
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            onChange(syntheticEvent);
        }
    };

    // Handle direct input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value === '' ? undefined : Number(e.target.value);
        setNum(newValue);

        if (onChange) {
            onChange(e);
        }
    };

    const styles = {
        bttnBg: 'bg-gray-100 hover:bg-gray-200',
        border: 'border border-gray-300',
        layout: 'p-3 h-11',
        focus: 'focus:ring-gray-100 focus:ring-2 focus:outline-none',
        dark: 'dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:focus:ring-gray-700',
        left: 'rounded-s-lg',
        right: 'rounded-e-lg',
        inputBorder: 'border-y border-gray-300',
        inputBg: 'bg-gray-50',
        text: 'text-center text-gray-900 text-sm',
        inputFocus: 'focus:ring-blue-500 focus:border-blue-500',
        alterInput:
            'appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]',
    };

    const bttnLeft = `${styles.bttnBg} ${styles.border} ${styles.layout} ${styles.focus} ${styles.dark} ${styles.left}`;
    const bttnRight = `${styles.bttnBg} ${styles.border} ${styles.layout} ${styles.focus} ${styles.dark} ${styles.right}`;

    return (
        <InputWrapper>
            {title && <FormLabel id={id} name={name} title={title} />}
            <div className="flex self-start justify-center items-center">
                <button type="button" className={bttnLeft} onClick={handleIncrement(-1)}>
                    <Icon name="CaretLeft" color="grey" size={12} />
                </button>
                <input
                    type="number"
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={num ?? ''}
                    onChange={handleInputChange}
                    className={`w-16  ${styles.layout} ${styles.border} ${styles.inputBg} ${styles.text} ${styles.inputFocus} ${styles.alterInput}`}
                    required={required}
                    min={min}
                />
                <button type="button" className={bttnRight} onClick={handleIncrement(1)}>
                    <Icon name="CaretRight" color="grey" size={12} />
                </button>
            </div>
        </InputWrapper>
    );
};
