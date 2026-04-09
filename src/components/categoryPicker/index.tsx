"use client"
import { ICategory } from '@/interfaces/category';
import React from 'react'

// 1. Mở rộng ICategory để chứa thêm mảng children
export interface ICategoryNode extends ICategory {
  children?: ICategoryNode[];
}

interface CategoryPickerProps {
  categories: ICategoryNode[]; // Đổi sang ICategoryNode
  categoryFilters: string[]; 
  setCategoryFilters: (filters: string[]) => void; 
  level?: number; // 2. Thêm prop level để tính độ thụt lề cho danh mục con
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ 
  categories, 
  categoryFilters, 
  setCategoryFilters,
  level = 0 // Mặc định danh mục gốc là level 0
}) => {
    
  const handleCheck = (item: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      if (!categoryFilters.includes(item)) {
        setCategoryFilters([...categoryFilters, item]);
      }
    } else {
      if (categoryFilters.includes(item)) {
        setCategoryFilters(categoryFilters.filter((categoryId: string) => categoryId !== item));
      }
    }
  };

  return (
    // 3. Nếu là level > 0 (danh mục con), thêm padding bên trái và viền dọc
    <div className={level === 0 ? "max-w-md py-2" : "ml-6 mt-2 border-l-2 border-slate-100 pl-3"}>
      <ul className="flex flex-col gap-2">
        {categories && categories.map((item) => {
          
          // Kiểm tra xem đây có phải là category cha không (có mảng children và mảng đó có phần tử)
          const isParent = item.children && item.children.length > 0;

          return (
            <li key={item.id} className="flex flex-col">
              
              {/* Giao diện 1 mục Category */}
              <div className="flex items-center">
                {isParent ? (
                  // NẾU LÀ CHA: Không có checkbox, chỉ hiển thị tên bằng thẻ span
                  <span 
                    className={`capitalize ${
                      level === 0 ? 'font-semibold text-slate-800' : 'font-medium text-slate-700'
                    }`}
                  >
                    {item.name}
                  </span>
                ) : (
                  // NẾU LÀ CON (Hoặc không có con): Hiển thị checkbox bình thường
                  <>
                    <input 
                      id={item.id} 
                      type="checkbox" 
                      checked={categoryFilters.includes(item.id)} 
                      name="category" 
                      className="w-4 h-4 accent-darkgrey cursor-pointer rounded-sm" 
                      onChange={(e) => handleCheck(item.id, e)}
                    />
                    <label 
                      htmlFor={item.id} 
                      className={`ml-3 capitalize cursor-pointer hover:text-black transition-colors ${
                        level === 0 ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'
                      }`}
                    >
                      {item.name}
                    </label>
                  </>
                )}
              </div>

              {/* 4. ĐỆ QUY: Nếu có danh mục con, gọi lại chính CategoryPicker */}
              {isParent && (
                <CategoryPicker 
                  categories={item.children!} // Dùng ! vì đã check isParent ở trên
                  categoryFilters={categoryFilters} 
                  setCategoryFilters={setCategoryFilters}
                  level={level + 1} // Tăng level lên 1 để thụt lề sâu hơn
                />
              )}
              
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export default CategoryPicker;