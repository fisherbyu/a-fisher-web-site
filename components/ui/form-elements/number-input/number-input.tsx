'use client';
import { Icon } from 'thread-ui';
import { FormLabel } from '../form-label';
import { INPUT_STYLES } from '../input-styles';
import { InputWrapper } from '../input-wrapper';
import { NumberInputProps } from './number-input.types';
import { useState } from 'react';

{
    /* <input
    type="number"
    id={id}
    name={name}
    required={required}
    value={value}
    onChange={onChange}
    className={INPUT_STYLES.standard}
    min={min}
    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
/>; */
}

export const NumberInput = ({ name, id = name, title, value, placeholder, required, onChange, min }: NumberInputProps) => {
    const [num, setNum] = useState(value);
    const handleIncrement = (increment: number) => {
        setNum((prevNum) => (prevNum ?? 1) + increment);
    };

    const BTTN_STYLES = {
        bg: 'bg-gray-100 hover:bg-gray-200',
        border: 'border border-gray-300',
        layout: 'p-3 h-11',
        focus: 'focus:ring-gray-100 focus:ring-2 focus:outline-none',
        dark: 'dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:focus:ring-gray-700',
        left: 'rounded-s-lg',
        right: 'rounded-e-lg',
    };

    const bttLeft = `${BTTN_STYLES.bg} ${BTTN_STYLES.border} ${BTTN_STYLES.layout} ${BTTN_STYLES.focus} ${BTTN_STYLES.dark} ${BTTN_STYLES.left}`;
    const bttnRight = `${BTTN_STYLES.bg} ${BTTN_STYLES.border} ${BTTN_STYLES.layout} ${BTTN_STYLES.focus} ${BTTN_STYLES.dark} ${BTTN_STYLES.right}`;

    return (
        <InputWrapper>
            {title && <FormLabel id={id} name={name} title={title} />}
            <div className="flex items-center">
                <button type="button" className={bttLeft}>
                    <Icon name="CaretLeft" color="grey" size={12} />
                </button>
                <input
                    type="number"
                    id={id}
                    data-input-counter
                    aria-describedby="helper-text-explanation"
                    placeholder={placeholder}
                    value={value}
                    className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required={required}
                />
                <button type="button" className={bttnRight}>
                    <Icon name="CaretRight" color="grey" size={12} />
                </button>
            </div>
        </InputWrapper>
    );
};
