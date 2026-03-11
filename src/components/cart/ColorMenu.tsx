import React from 'react'

type ColorMenuProps = {
  options: string[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

const ColorMenu = ({options, value, onChange} : ColorMenuProps) => {

  const SelectColorMenu = (option: any) => {
    onChange(option);
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }
  }
  return (
    <div className="dropdown">
      <button
        tabIndex={0}
        role='button'
        className="bg-transparent w-full flex flex-row gap-2 justify-between"
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
        className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-xl w-auto"
      >
        {options.map((option: any) => (
          <li key={option} onClick={() => SelectColorMenu(option)}>
            <a className="flex justify-between">
              {option}
            </a>
          </li>
        ))}
      </ul>
  </div>
  )
}

export default ColorMenu