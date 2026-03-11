import { ICategory } from '@/interfaces/category';
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect } from 'react'
import { RxArrowTopRight } from "react-icons/rx";

type CategoryProps = {
    category: ICategory;
}

const Category = ( {category} : CategoryProps) => {
  return (
    <Link className='relative' href={`/categories/${category.id}`}>
        <div className='h-auto w-full py-14 bg-[#eaefef] rounded-3xl'>
          <Image src='/logo.png' width={300} height={300} alt={category.name} className='object-cover m-auto rounded-3xl'/>
        </div>
        <div className='bottom-0 left-0 right-0 absolute px-8 py-4 flex flex-row justify-between'>
            <h3 className='text-darkgrey text-3xl font-semibold uppercase table-caption w-[1px]'>{category.name}</h3>
            <div className='self-end'>
                <button className='rounded-lg p-3 bg-darkgrey'>
                    <RxArrowTopRight color='white' size={25}/>
                </button>
            </div>
        </div>
    </Link>
  )
}

export default Category