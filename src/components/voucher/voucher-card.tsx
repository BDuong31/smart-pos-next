import { ICoupon } from '@/interfaces/coupon';
import { IUserCoupon } from '@/interfaces/user';
import { FaTicketAlt } from 'react-icons/fa'; // Icon vé voucher

type voucherProps = {
  userCoupon: IUserCoupon;
  coupon: ICoupon;
}
export default function VoucherCard({userCoupon, coupon}: voucherProps) {
  const isExpiredOrUsed = userCoupon.status === 'expired' || userCoupon.status === 'used';

  const formatDate = (dateStr: string | Date): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  return (
    <div className={`flex rounded-lg shadow-sm overflow-hidden ${isExpiredOrUsed ? 'bg-darkgrey' : 'bg-white'}`}>
      
      <div className={`flex flex-col items-center justify-center p-6 w-32 ${
          isExpiredOrUsed ? 'bg-graymain text-white' : 'bg-blue text-white'
        }`}>
        <FaTicketAlt className="w-6 h-6 mb-1" />
        <span className="font-bold text-xl">
          {coupon.type === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
        </span>
        <span className="text-sm">OFF</span>
      </div>
      
      <div className="border-l-2 border-dashed border-gray"></div>

      <div className={`flex-1 p-4 ${isExpiredOrUsed ? 'text-graymain' : ''}`}>
        <h3 className={`font-bold text-lg ${isExpiredOrUsed ? 'text-white' : 'text-darkgrey'}`}>{coupon.name}</h3>
        <p className={`text-sm ${isExpiredOrUsed ? 'text-gray' : 'text-darkgrey'}`}>{coupon.description}</p>
        <p className={`text-xs mt-2 ${isExpiredOrUsed ? 'text-gray' : 'text-[#FF0000]'}`}>
          Valid until: {formatDate(coupon.expiryDate)}
        </p>
      </div>

      <div className="flex items-center p-4">
        {userCoupon.status === 'available' && <button className="btn btn-primary btn-sm">Use Now</button>}
        {userCoupon.status === 'used' && <span className="font-semibold text-[#4CAF50]">Used</span>}
        {userCoupon.status === 'expired' && <span className="font-semibold text-gray">Expired</span>}
      </div>
    </div>
  );
}