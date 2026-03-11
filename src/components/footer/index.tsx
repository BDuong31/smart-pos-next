'use client'
import { getBrands } from '@/apis/brand';
import { getCategories } from '@/apis/category';
import { IBrand } from '@/interfaces/brand';
import { ICategory } from '@/interfaces/category';
import Image from 'next/image'
import Link from 'next/link';
import React, { use } from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok  } from "react-icons/fa";
import { SplashScreen } from '../loading';

const Footer = () => {
  const [category, setCategory] = React.useState<ICategory[]>()
  const [loading, setLoading] = React.useState<boolean>(true)

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategory(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchCategories();
  } , [])

  if (loading) {
    return <SplashScreen />;
  }
  return (
    <div className={`m-auto pt-32 md:px-0 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%]`}>
        <div className='grid md:grid-cols-2 grid-cols-1 gap-10 bg-blue px-10 pt-10 pb-32 text-white rounded-[40px]'>
            <div>
                <h1 className='xl:text-4xl lg:text-3xl md:text-2xl text-2xl font-semibold uppercase'>Join our BasoPlus <br/>Club & get 15% off</h1>
                <p className='pt-3 pb-5'>Sign up for free! Join the community.</p>
                <div className='flex gap-4'>
                    <input type="text" className='bg-transparent border border-[#BCBCBC] py-2 px-3 w-1/2 rounded-lg placeholder-[#BCBCBC]' placeholder='Enter your email' />
                    <button className='bg-darkgrey py-2 px-6 rounded-lg text-sm'>SUBMIT</button>
                </div>
            </div>
            <div className='m-auto flex items-center'>
              <Image src="/basoplus.png" width={225} height={279} alt="kicks logo"/>
            </div>

        </div>
        <div className='px-10 pt-7 bg-darkgrey rounded-[40px] -mt-24'>
          <div className='grid xl:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4 '>
              <div className='col-span-2'>
                <h1 className='text-3xl text-yellow font-medium py-2'>About us</h1>
                <p className='text-gray xl:pr-28 lg:pr-18'>We are the biggest hyperstore in the universe. We got you all cover with our exclusive collections and latest drops.</p>
              </div>
              <div>
                <h1 className='text-xl text-yellow font-medium py-2'>Categories</h1>
                <ul className='text-gray'>
                  {category?.map((cat) => (
                    <li key={cat.id} className='mb-2'>
                      <Link href={`/category/${cat.id}`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul> 
              </div>
              <div>
                <h1 className='text-xl text-yellow font-medium py-2'>Company</h1>
                <ul className='text-gray'>
                  <li className='mb-2'>
                    <Link href={'/about'}>
                    About
                    </Link>
                  </li>
                  <li className='mb-2'>
                    <Link href={'/contact'}>
                      Contact
                    </Link>
                  </li>
                  <li className='mb-2'>
                    <Link href={'/blogs'}>
                      Blogs
                    </Link>
                  </li>
                </ul> 
              </div>
              <div>
                <h1 className='text-xl text-yellow font-medium py-2'>Follow us</h1>
                <div className='flex gap-5'>
                  <Link href={'https://www.facebook.com'}>
                    <FaFacebook size={20} color='#E7E7E3'/>
                  </Link>
                  <Link href={'https://www.instagram.com'}>
                    <FaInstagram size={20} color='#E7E7E3'/>
                  </Link>
                  <Link href={'https://twitter.com'}>
                    <FaTwitter size={20} color='#E7E7E3'/>
                  </Link>
                  <Link href={'https://www.tiktok.com/'}>
                    <FaTiktok size={20} color='#E7E7E3'/>
                  </Link>
                </div>
              </div>
          </div>
              <Image src="/footerbassso.png" alt="baso logo" width={833} height={112} className='pt-10 justify-self-center max-w-full h-auto'/>
        </div>
        <h1 className='py-5 text-center flex items-center justify-center'>© All rights reserved | Made with baso</h1>
    </div>
  )
}

export default Footer