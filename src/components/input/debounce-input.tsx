import React from 'react';
import { Input } from '.';
import { clear } from 'console';
import { on } from 'events';

export default function DebounceInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>){
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            return onChange(String(value));
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value, onChange, debounce]);

    return (
        <Input
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value as string)}
        />
    )
}