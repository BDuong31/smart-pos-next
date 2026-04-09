import React, { useMemo } from 'react';
import CategoryPicker from '../categoryPicker'; // Đảm bảo đường dẫn import đúng
// import ColorPicker from '../colorPicker';
// import Sizepicker from '../sizePicker';

// Các Interfaces bạn vừa định nghĩa
export interface ICategory {
  id: string;
  name: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryCreate {
  name: string;
  parentId?: string | null;
}

export interface ICategoryUpdate {
  name?: string;
  parentId?: string | null;
}

// Interface mở rộng để chứa các danh mục con
export interface ICategoryNode extends ICategory {
  children: ICategoryNode[];
}

interface FiltersProps {
  Categories?: ICategory[];
  categoryFilters?: string[]; 
  setCategoryFilters?: (filters: string[]) => void; // Khai báo chuẩn type function
}

const Filters: React.FC<FiltersProps> = ({ 
  Categories = [], 
  categoryFilters = [], 
  setCategoryFilters = () => {} 
}) => {

  // Chuyển đổi mảng 1 chiều thành cấu trúc Cây (Tree) dựa vào parentId
  const categoryTree = useMemo(() => {
    if (!Categories || Categories.length === 0) return [];

    const categoryMap = new Map<string, ICategoryNode>();
    const roots: ICategoryNode[] = [];

    // Khởi tạo map với các node trống children
    Categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Gom nhóm cha - con
    Categories.forEach((cat) => {
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        // Nếu có parentId -> Push vào children của node cha
        categoryMap.get(cat.parentId)!.children.push(categoryMap.get(cat.id)!);
      } else {
        // Nếu không có parentId -> Nó là danh mục gốc (root)
        roots.push(categoryMap.get(cat.id)!);
      }
    });

    return roots;
  }, [Categories]);

  return (
    <div>
      {Categories && Categories.length > 0 && (
        <div className="collapse collapse-arrow mb-4">
          <input type="checkbox" defaultChecked className="peer" /> 
          <div className="collapse-title text-md font-semibold text-slate-800">
            Danh mục
          </div>
          <div className="collapse-content"> 
            {/* Truyền cây danh mục (đã được gom nhóm) vào CategoryPicker */}
            <CategoryPicker 
              categories={categoryTree} // Lưu ý: Truyền tree thay vì mảng phẳng
              categoryFilters={categoryFilters} 
              setCategoryFilters={setCategoryFilters} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;