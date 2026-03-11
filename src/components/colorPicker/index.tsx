"use client"
import React, { useEffect, useState } from 'react'

interface ColorPickerFilterProps {
    colors: any[];
    colorFilters: string[]; 
    setColorFilters: any; 
  }

interface ColorPickerProps {
    colors: string[];
    selectedColor: string | undefined;
    setSelectedColor: (color: string | undefined) => void;
    isColorAvailable: (color: string) => boolean;
}

const ColorPickerFilter: React.FC<ColorPickerFilterProps> = ( { colors, colorFilters, setColorFilters }) => {
    const handleCheck = (item: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        if (isChecked) {
          if (!colorFilters.includes(item)) {
            setColorFilters([...colorFilters, item]);
          }
        } else {
          if (colorFilters.includes(item)) {
            setColorFilters(colorFilters.filter((color) => color !== item));
          }
        }
      };

    useEffect(() => {
    } , [colorFilters])
  return (
    <div className="max-w-md py-3 mb-3">
            <ul className="flex flex-wrap gap-4">
                { colors &&
                    colors.map((item, idx) => (
                        <li key={idx} className={`flex-none`}>
                            <label htmlFor={item} className="block relative w-[40px] h-[40px]">
                                <input id={item} type="checkbox" name="color" className="sr-only peer" onChange={(e) => handleCheck(item, e)}/>
                                <span id={item} className={`inline-flex justify-center items-center w-full h-full rounded-lg cursor-pointer duration-150`} style={{ boxShadow: colorFilters.includes(item) ? `rgb(255, 255, 255) 0px 0px 0px 2px, ${item} 0px 0px 0px 5px, rgba(0, 0, 0, 0) 0px 0px 0px 0px` : '', backgroundColor: `${item}`}} >
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-white absolute inset-0 m-auto z-0 pointer-events-none hidden peer-checked:block duration-150">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </label>
                        </li>
                    ))
                }
            </ul>
        </div>
  )
}

export default ColorPickerFilter
const ColorPickerSelected: React.FC<ColorPickerProps> = ( { colors, selectedColor, setSelectedColor, isColorAvailable }) => {
  const handleChange = (item: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedColor === item) {
        setSelectedColor(undefined);
    } else {
      setSelectedColor(item);
    }
  };

  return (
    <div className="max-w-md py-3 mb-3">
            <ul className="flex flex-wrap gap-4">
                { colors &&
                    colors.map((item, idx) => {
                      const isAvailable = isColorAvailable(item);
                      return (
                        <li key={idx} className={`flex-none`}>
                            <label htmlFor={`color-${item}`} className={`block relative w-[40px] h-[40px] ${!isAvailable ? 'opacity-40' : 'cursor-pointer'}`}>
                                <input 
                                    id={`color-${item}`} 
                                    type="checkbox" 
                                    name="color-picker" 
                                    className="sr-only peer" 
                                    checked={selectedColor === item} 
                                    onChange={(e) => handleChange(item, e)}
                                />
                                <span 
                                    // SỬA LỖI: XÓA 'id' KHỎI SPAN
                                    // id={`color-${item}`} // <-- XÓA DÒNG NÀY
                                    className={`inline-flex justify-center items-center w-full h-full rounded-lg cursor-pointer duration-150`} 
                                    style={{ boxShadow: selectedColor === item ? `rgb(255, 255, 255) 0px 0px 0px 2px, ${item} 0px 0px 0px 5px, rgba(0, 0, 0, 0) 0px 0px 0px 0px` : '', backgroundColor: `${item}`}} 
                                >
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-white absolute inset-0 m-auto z-0 pointer-events-none hidden peer-checked:block duration-150">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </label>
                        </li>
                      )
                    }
                  )
                }
            </ul>
        </div>
  )
}
export  { ColorPickerSelected }; ;