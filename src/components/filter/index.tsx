import React from 'react'
import ColorPicker from '../colorPicker'
import Sizepicker from '../sizePicker'
import CategoryPicker from '../categoryPicker'
import { ICategory } from '@/interfaces/category';

interface FiltesProps {
  Colors: any[];
  colorFilters: string[]; 
  setColorFilters: any; 
  Sizes: any[];
  sizeFilters: string[]; 
  setSizeFilters: any; 
  Categories?: ICategory[];
  categoryFilters?: string[]; 
  setCategoryFilters?: any; 
}
const Filters : React.FC<FiltesProps>  = ( { Colors, colorFilters, setColorFilters, Sizes, sizeFilters, setSizeFilters, Categories, categoryFilters, setCategoryFilters }) => {
  
  return (
    <div>
      <div className="collapse collapse-arrow mb-4">
        <input type="checkbox" defaultChecked className="peer" /> 
        <div className="collapse-title text-md font-semibold">
            COLORS
        </div>
        <div className="collapse-content"> 
            <ColorPicker colors={Colors} colorFilters={colorFilters} setColorFilters={setColorFilters}/>
        </div>
      </div>
      <div className="collapse collapse-arrow mb-4">
        <input type="checkbox" defaultChecked className="peer" /> 
        <div className="collapse-title text-md font-semibold">
            SIZES
        </div>
        <div className="collapse-content"> 
        <Sizepicker sizes={Sizes} sizeFilters={sizeFilters} setSizeFilters={setSizeFilters} />
        </div>
      </div>
      {Categories && (
        <div className="collapse collapse-arrow mb-4">
          <input type="checkbox" defaultChecked className="peer" /> 
          <div className="collapse-title text-md font-semibold">
              CATEGORIES
          </div>
          <div className="collapse-content"> 
          <CategoryPicker categories={Categories} categoryFilters={categoryFilters ?? []} setCategoryFilters={setCategoryFilters ?? (() => {})} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Filters