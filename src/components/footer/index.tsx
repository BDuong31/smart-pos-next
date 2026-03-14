'use client'
// import { getBrands } from '@/apis/brand';
// import { getCategories } from '@/apis/category';
// import { IBrand } from '@/interfaces/brand';
// import { ICategory } from '@/interfaces/category';
import Image from 'next/image'
import Link from 'next/link';
import React, { use } from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok  } from "react-icons/fa";
import { SplashScreen } from '../loading';

const Footer = () => {
  // const [category, setCategory] = React.useState<ICategory[]>()
  const [loading, setLoading] = React.useState<boolean>(true)

  // const fetchCategories = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await getCategories();
  //     setCategory(res.data);
  //   } catch (error) {
  //     console.error('Error fetching categories:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // React.useEffect(() => {
  //   fetchCategories();
  // } , [])

  // if (loading) {
  //   return <SplashScreen />;
  // }
  return (
    <div className={`m-auto pt-32 md:px-0 3xl:max-w-[1500px] 2xl:max-w-[1450px] xl:max-w-[90%] lg:max-w-[90%] max-w-[95%]`}>
        <div className='grid md:grid-cols-2 grid-cols-1 gap-10 bg-blue px-10 pt-10 pb-32 text-white rounded-[40px]'>
            <div>
                <h1 className='xl:text-4xl lg:text-3xl md:text-2xl text-2xl font-semibold uppercase'>Đăng ký nhận thông báo</h1>
                <p className='pt-3 pb-5'>Nhận thông báo về các món mới và ưu đãi hấp dẫn mới nhất</p>
                <div className='flex gap-4'>
                    <input type="text" className='bg-transparent border border-[#BCBCBC] py-2 px-3 w-1/2 rounded-lg placeholder-[#BCBCBC]' placeholder='Nhập email của bạn' />
                    <button className='bg-darkgrey py-2 px-6 rounded-lg text-sm'>GỬI</button>
                </div>
            </div>
            <div className='m-auto flex items-center'>
              <Image src="/logo.png" width={225} height={279} alt="kicks logo"/>
            </div>

        </div>
        <div className='px-10 pt-7 bg-darkgrey rounded-[40px] -mt-24'>
          <div className='grid xl:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4 '>
              <div className='col-span-2'>
                <h1 className='text-3xl text-yellow font-medium py-2'>Baso Corner</h1>
                <p className='text-gray xl:pr-28 lg:pr-18'>nền tảng giúp khách hàng dễ dàng khám phá thực đơn, đặt món và đặt bàn trực tuyến một cách nhanh chóng. Chúng tôi mang đến trải nghiệm ẩm thực tiện lợi, giúp bạn kết nối với nhà hàng yêu thích chỉ trong vài thao tác đơn giản.</p>
              </div>
              <div>
                <h1 className='text-xl text-yellow font-medium py-2'>Liên kết nhanh</h1>
                <ul className='text-gray'>
                  {/* {category?.map((cat) => (
                    <li key={cat.id} className='mb-2'>
                      <Link href={`/category/${cat.id}`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))} */}
                  <li className='mb-2'><Link href={'/about'}>Về chúng tôi</Link></li>
                  <li className='mb-2'><Link href={'/locations'}>Hệ thống nhà hàng</Link></li>
                  <li className='mb-2'><Link href={'/careers'}>Tuyển dụng</Link></li>
                </ul> 
              </div>
              <div>
                <h1 className='text-xl text-yellow font-medium py-2'>Chính sách</h1>
                <ul className='text-gray'>
                  <li className='mb-2'>
                    <Link href={'/delivery-policy'}>
                      Chính sách giao hàng
                    </Link>
                  </li>
                  <li className='mb-2'>
                    <Link href={'/privacy-policy'}>
                      Chính sách bảo mật
                    </Link>
                  </li>
                  <li className='mb-2'>
                    <Link href={'/terms-of-service'}>
                      Điều khoản dịch vụ
                    </Link>
                  </li>
                  <li className='mb-2'>
                    <Link href={'/faq'}>
                      Câu hỏi thường gặp
                    </Link>
                  </li>
                </ul> 
              </div>
              <div>
                <h1 className='text-xl text-yellow font-medium py-2'>Theo dõi chúng tôi</h1>
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
        <h1 className='py-5 text-center flex items-center justify-center'>© Tất cả quyền được bảo lưu | Được tạo bởi Baso</h1>
    </div>
  )
}

export default Footer