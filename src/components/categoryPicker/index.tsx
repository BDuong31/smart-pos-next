"use client"
import { ICategory } from '@/interfaces/category';
import React, { useEffect, useState } from 'react'

interface ColorPickerProps {
    categories: ICategory[];
    categoryFilters: string[]; 
    setCategoryFilters: any; 
  }
const CategoryPicker: React.FC<ColorPickerProps> = ( { categories, categoryFilters, setCategoryFilters }) => {
    console.log("categoryPicker rendered", categories);
    const handleCheck = (item: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        if (isChecked) {
          if (!categoryFilters.includes(item)) {
            setCategoryFilters([...categoryFilters, item]);
          }
        } else {
          if (categoryFilters.includes(item)) {
            setCategoryFilters(categoryFilters.filter((color) => color !== item));
          }
        }
      };

    useEffect(() => {
    } , [categoryFilters])
  return (
    <div className="max-w-md py-3 mb-3">
            <ul className="">
                { categories &&
                    categories.map((item, idx) => (
                        <li key={idx} className={`flex items-center pb-1`}>
                            <input id={item?.id} type="checkbox" checked={categoryFilters.includes(item?.id)} name="category" className="w-4 h-4 accent-darkgrey" onChange={(e) => handleCheck(item?.id, e)}/>
                            <label htmlFor={item?.id} className="ml-3 font-medium capitalize">{item?.name}</label>
                        </li>
                    ))
                }
            </ul>
        </div>
  )
}

export default CategoryPicker