// import React from 'react'

// type QtyMenuProps = {
//   options: number;
//   value: number | undefined;
//   onChange: (value: number) => void;
//   disabled?: boolean;
// }

// const QtyMenu = ({options, value, onChange, disabled = false} : QtyMenuProps) => {

//   const SelectQtyMeu = (option: number) => {
//     onChange(option);
//     const elem = document.activeElement as HTMLElement;
//     if (elem) {
//       elem.blur();
//     }
//   }

//   return (
//     <div className={`dropdown ${disabled ? 'opacity-50' : ''}`}>
//       <button
//         tabIndex={0}
//         role='button'
//         className="bg-transparent w-full flex flex-row gap-2 justify-between"
//         disabled={disabled}
//       >
//         <span>{value}</span>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-5 h-5 my-auto text-gray-400 right-3"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>
//       <ul
//         tabIndex={0}
//         className="dropdown-content z-[1] p-2 shadow-lg bg-white rounded-xl w-auto max-h-60 overflow-y-auto flex flex-col"
//       >
//         {options.map((option: number) => (
//           <li key={option} onClick={() => SelectQtyMeu(option)}>
//             <a className={`flex justify-between ${option === value ? 'font-bold' : ''}`}>
//               {option}
//             </a>
//           </li>
//         ))}
//       </ul>
//   </div>
//   )
// }

// export default QtyMenu

import React, { useState, useEffect } from 'react';

type InputQtyProps = {
  value: number; // Giá trị "thật" từ CartItem (selectedQty)
  maxStock: number; // Số lượng tồn kho tối đa
  onChange: (newQty: number) => void; // Hàm onQtyChange từ CartItem
  disabled?: boolean;
};

const QtyMenu = ({ value, maxStock, onChange, disabled = false }: InputQtyProps) => {
  const [internalValue, setInternalValue] = useState(value.toString());

  useEffect(() => {
    setInternalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  const handleBlur = () => {
    let newQty = parseInt(internalValue, 10);

    if (isNaN(newQty)) {
      newQty = value; 
    } 
    
    else if (newQty < 1) {
      newQty = (maxStock > 0) ? 1 : 0; 
    } 
    else if (newQty > maxStock) {
      newQty = maxStock;
    }

    setInternalValue(newQty.toString());
    
    if (newQty !== value) {
      onChange(newQty);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLElement).blur(); 
    }
  };

  const isOutOfStock = maxStock === 0;

  return (
    <div className="flex flex-col items-center">
      <input
        type="number"
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled || isOutOfStock}
        className="h-10 w-20 rounded-lg border border-gray-300 text-center"
        min="1"
        max={maxStock}
      />
      { isOutOfStock === false && maxStock > 10 && (
        <p className="text-xs text-graymain mt-1">
          {maxStock} In Stock
        </p>
      )}
      { isOutOfStock === false && maxStock <= 10 && (
        <p className="text-xs text-[#ff0000] mt-1">
          Only {maxStock} left
        </p>
      )}
       { isOutOfStock === true && (
        <p className="text-xs text-[#ff0000] mt-1">
          Out of stock
        </p>
      )}
    </div>
  );
};

export default QtyMenu;