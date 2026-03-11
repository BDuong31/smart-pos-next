import React from 'react';
import { Check } from 'lucide-react';

type SelectMenuProps = {
  options: (number)[];
  value: (number);
  onChange: (value: number) => void;
  disabled?: boolean;
};

const SelectMenu = ({ options, value, onChange, disabled = false }: SelectMenuProps) => {
  const handleSelect = (option: number) => {
    onChange(option);
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }
  };

  return (
    <div className={`dropdown ${disabled ? 'opacity-50' : ''}`}>
      <button 
        tabIndex={0} 
        role="button" 
        className="bg-transparent w-full flex flex-row gap-2 justify-between"
        disabled={disabled}
      >
        <span>{value}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 my-auto text-gray-400 right-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <ul 
        tabIndex={0} 
        className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-xl w-auto max-h-60 overflow-y-auto flex flex-col"
      >
        {options.map((option) => (
          <li key={option} onClick={() => handleSelect(option)}>
            <a className="flex justify-between">
              {option}
              {value === option && <Check className="h-5 w-5" />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectMenu;