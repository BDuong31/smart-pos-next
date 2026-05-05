'use client'
import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/toast-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getTableById } from '@/apis/table';
import { ITableDetail } from '@/interfaces/table';

export type CheckoutFormData = {
  tableId?: string | null;
  note?: string;
  // Bỏ addressId và deliveryOption
}

type CheckoutFormProps = {
  onSubmit: (data: CheckoutFormData) => void;
};

const CheckoutForm = ({ onSubmit }: CheckoutFormProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const tableId = sessionStorage.getItem('customer_table_id');
  const { showToast } = useToast();

  const [formData, setFormData] = useState<CheckoutFormData>({
    tableId: tableId,
    note: ''
  });

  const [table, setTable] = useState<ITableDetail | null>(null);
  const [isCheckYearOld, setIsCheckYearOld] = useState(false);
  const [isCheckReceiveEmail, setIsCheckReceiveEmail] = useState(false);

  const fetchTable = async () => {
    const table = await getTableById(tableId || '');
    if(table){
      setTable(table.data)
    }
  };
  
  useEffect(() => {
    fetchTable();
  }, [tableId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitClick = () => {
    if (!isCheckYearOld) {
      showToast('Vui lòng xác nhận bạn trên 13 tuổi.', 'error');
      return;
    }

    if (!tableId) {
      showToast('Vui lòng quyét mã QR tại bàn để tiếp tục.', 'error');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className="text-2xl font-semibold mb-2">Thông tin khách hàng</h1>
        <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-100 flex flex-col gap-1'>
          {user ? (
            <>
              <p className='font-bold text-lg'>{user.fullName}</p>
              <p className='text-slate-600'>{user.email}</p>
            </>
          ) : (
            <p className='text-slate-500 italic'>Vui lòng đăng nhập để tiếp tục...</p>
          )}
        </div>
      </div>

      {/* THÔNG TIN BÀN VÀ GHI CHÚ */}
      <div>
        <h1 className='text-2xl font-semibold mb-4'>Thông tin gọi món</h1>
        <div className='space-y-4'>
          <div className='flex flex-col gap-2'>
            {tableId ? (
              <label htmlFor="tableId" className='font-medium text-slate-800'>Tên bàn: {table?.name}</label>
            ) : (
              <p className='text-slate-500 italic'>Vui lòng quyét mã QR tại bàn để tiếp tục</p>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="note" className='font-medium text-slate-800'>Ghi chú cho bếp</label>
            <textarea 
              name="note" 
              id="note" 
              rows={3}
              placeholder="Ít cay, không hành..."
              value={formData.note || ''}
              onChange={handleChange}
              className='border border-slate-300 rounded-lg p-3 outline-none focus:border-darkgrey resize-none'
            />
          </div>
        </div>
      </div>

      {/* XÁC NHẬN ĐIỀU KHOẢN */}
      <div className='space-y-4 pt-4 border-t border-slate-200'>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="ageConfirmation"
            id="ageConfirmation"
            checked={isCheckYearOld} 
            onChange={() => setIsCheckYearOld(!isCheckYearOld)} 
            className="h-5 w-5 rounded border-[#232321] bg-transparent checked:bg-darkgrey checked:border-darkgrey focus:ring-0 appearance-none flex items-center justify-center relative before:content-[''] before:hidden checked:before:block before:w-3 before:h-3 before:bg-white before:rounded-sm"
          />
          <label htmlFor="ageConfirmation" className="text-black cursor-pointer">
            Tôi xác nhận mình trên 13 tuổi
          </label>
        </div>
        
        <div className="flex flex-col">
          <div className='flex items-center gap-3'>
            <input
              type="checkbox"
              name="emailSubscription"
              id="emailSubscription"
              checked={isCheckReceiveEmail} 
              onChange={() => setIsCheckReceiveEmail(!isCheckReceiveEmail)} 
              className="h-5 w-5 rounded border-[#232321] bg-transparent checked:bg-darkgrey checked:border-darkgrey focus:ring-0 appearance-none flex items-center justify-center relative before:content-[''] before:hidden checked:before:block before:w-3 before:h-3 before:bg-white before:rounded-sm"
            />
            <label htmlFor="emailSubscription" className="text-black cursor-pointer">
              Đăng ký nhận thông tin khuyến mãi qua Email.
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmitClick}
        disabled={!user}
        className='w-full sm:w-[49%] bg-darkgrey text-fawhite rounded-lg py-3.5 mt-5 font-semibold uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Xem lại và thanh toán
      </button>

    </div>
  );
};

export default CheckoutForm;