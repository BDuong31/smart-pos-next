import { getAddresses } from '@/apis/address';
import { useUserProfile } from '@/context/user-context';
import { IAddress } from '@/interfaces/address';
import React from 'react';
import AddressModal, { AddressListModal } from '../address/address-modal';
import { useToast } from '@/context/toast-context';

export type CheckoutFormData = {
  addressId?: string | null;
  deliveryOption: 'standard' | 'collect';
}

type CheckoutFormProps = {
  onSubmit: (data: CheckoutFormData) => void;
  onChangeDeliveryOption?: (option: 'standard' | 'collect') => void;
};
const CheckoutForm = ({ onSubmit, onChangeDeliveryOption} : CheckoutFormProps) => {
  const {userProfile} = useUserProfile();
    const [isCheckbillandDevedelivery, setIsCheckbillandDevedelivery] = React.useState(false);
    const [isCheckYearOld, setIsCheckYearOld] = React.useState(false);
    const [isCheckReceviceEmail, setIsCheckReceviceEmail] = React.useState(false);

    const [addresses, setAddresses] = React.useState<IAddress[]>([]);
    const [selectedAddress, setSelectedAddress] = React.useState<IAddress | null>(null);
    const [editingAddress, setEditingAddress] = React.useState<IAddress | null>(null);
    const INITIAL_DATA: CheckoutFormData = {
      addressId: selectedAddress?.id ?? null,
      deliveryOption: 'standard',
    };
    
    const [formData, setFormData] = React.useState(INITIAL_DATA);

    const { showToast } = useToast();
    const fetchAddresses = async () => {
      try {
        const response = await getAddresses();
        setAddresses(response.data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    }

    const openSelectModal = () => {
        (document.getElementById('select_address_modal') as HTMLDialogElement)?.showModal();
    };

    const openAddModal = () => {
        (document.getElementById('add_address_modal') as HTMLDialogElement)?.showModal();
    }

    const openEditModal = () => {
        (document.getElementById('update_address_modal') as HTMLDialogElement)?.showModal();
    };

    const handleSelectAddress = (address: IAddress) => {
        setSelectedAddress(address);
        setFormData((prev) => ({
          ...prev,
          addressId: address.id,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleDeliveryChange = (option: 'standard' | 'collect') => {
      setFormData((prev) => ({
        ...prev,
        deliveryOption: option,
      }));
      if (onChangeDeliveryOption) {
        onChangeDeliveryOption(option);
      }
      setFormData((prev) => ({
        ...prev,
        addressId: option === 'standard' ? selectedAddress?.id || '' : null,
      }));
    };

    const handleSubmitClick = () => {
      if (!isCheckbillandDevedelivery || !isCheckYearOld || !isCheckReceviceEmail) {
        showToast('Please agree to all terms before proceeding.', 'error');
        return;
      }
      onSubmit(formData);
    };
    const cardElementOptions = {
      style: {
        base: {
          fontSize: '16px',
          color: 'red',
          fontFamily: 'Arial, sans-serif',
          '::placeholder': {
            color: '#aab7c4',
          },
          backgroundColor: 'transparent', // Set background color to transparent
        },
        invalid: {
          color: '#fa755a',
        },
      },
    };

    React.useEffect(() => {
      fetchAddresses();
    }, [userProfile]);

    React.useEffect(() => {
      if (addresses) {
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    }, [addresses]);

    React.useEffect(() => {
      setFormData((prev) => ({
        ...prev,
        addressId: selectedAddress?.id || null,
      }));
    }, [selectedAddress]);
  return (
    <div className='space-y-6'>
      {formData.deliveryOption === 'standard' && (
        <>
          <div>
            <h1 className="text-2xl font-semibold">Delivery Address</h1>
            <p className='text-graymain'>We will use these details to keep you inform about your delivery.</p>
          </div>
          {selectedAddress ? (
            <div className='p-4 bg-white rounded-lg shadow-sm flex justify-between items-start'>
              <div className='flex flex-col gap-1'>
                <p className='font-bold'>{selectedAddress.fullName}</p>
                <p>{selectedAddress.streetAdress}, {selectedAddress.cityProvince}</p>
                <p>{selectedAddress.phone}</p>
              </div>
              <button
                  onClick={openSelectModal}
                  className="text-blue-600 hover:underline font-semibold"
              >
                Change
              </button>
            </div>
          ) : (
            <p className='text-graymain'>No address selected.</p>
          )}
        </>
      )}      
      <div>
        <h1 className='text-2xl font-semibold mb-4'>Delivery Options</h1>
        <div className='space-y-3'>
          <div
            onClick={()=> {
              handleDeliveryChange('standard');
            }}
            className={`rounded-lg p-4 flex justify-between items-center cursor-pointer transition-all ${
              formData.deliveryOption === 'standard'
                ? 'bg-white shadow-sm border-2 border-white'
                : 'bg-transparent border border-[#232321]'
            }`}
          >
            <div className='flex justify-between w-full items-center'>
              <div>
                <p className="font-bold">Standard Delivery</p>
                <p className="text-sm text-graymain">
                  Enter your address to see when you'll get your order
                </p>
              </div>
              <span className={`font-semibold ${formData.deliveryOption === 'standard' ? 'text-blue' : ''}`}>
                $6.00
              </span>
            </div>
          </div>
          <div
            onClick={() => {
              handleDeliveryChange('collect')
            }}
            className={`rounded-lg p-4 flex justify-between items-center cursor-pointer transition-all ${
              formData.deliveryOption === 'collect'
                ? 'bg-white shadow-sm border-2 border-white'
                : 'bg-transparent border border-[#232321]'
            }`}
          >
            <div className='flex justify-between w-full items-center'>
              <div>
                <p className="font-bold">Collect In-Store</p>
                <p className="text-sm text-graymain">
                  Pick up your order from a store near you
                </p>
              </div>
              <span className={`font-semibold ${formData.deliveryOption === 'collect' ? 'text-blue' : ''}`}>
                Free
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-4 pt-2'>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="billingSameAsDelivery"
            id="billingSameAsDelivery"
            checked={isCheckbillandDevedelivery} 
            onChange={() => {
              setIsCheckbillandDevedelivery(!isCheckbillandDevedelivery)}
            } 
            className="h-5 w-5 rounded border-gray-400 bg-transparent checked:bg-[#000000] checked:border-[#000000] checked:text-[#000000] appearance-none"
          />
          <label htmlFor="billingSameAsDelivery" className="text-black">
            My billing address is the same as my delivery address
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="ageConfirmation"
            id="ageConfirmation"
            checked={isCheckYearOld} 
            onChange={() => setIsCheckYearOld(!isCheckYearOld)} 
            className="h-5 w-5 rounded border-[#232321] bg-transparent checked:bg-[#000000] checked:border-[#000000] checked:text-[#000000] appearance-none"
          />
          <label htmlFor="ageConfirmation" className="text-black">
            I’m 13+ year old
          </label>
        </div>
        <div className="flex flex-col">
          <h1 className='font-bold text-[#000000]'>Also want product updates with our newsletter?</h1>
          <div className='flex  items-center gap-3'>
            <input
              type="checkbox"
              name="emailSubscription"
              id="emailSubscription"
              checked={isCheckReceviceEmail} 
              onChange={() => setIsCheckReceviceEmail(!isCheckReceviceEmail)} 
              className="h-5 w-5 rounded border-[#232321] bg-transparent checked:bg-[#000000] checked:border-[#000000] checked:text-[#000000] appearance-none"
            />
            <label htmlFor="emailSubscription" className="text-black">
              Yes, I’d like to receive emails about exclusive sales and more.
            </label>
          </div>
        </div>
      </div>
      <button
        onClick={handleSubmitClick}
        className='w-[49%] bg-darkgrey text-fawhite rounded-lg py-2 px-9 mt-5 uppercase'
      >
        Review and Pay
      </button>
      <AddressListModal 
        modalId="select_address_modal"
        addresses={addresses}
        onSelectAddress={(address) => {
          handleSelectAddress(address)
        }}
        onAddNew={() => {
          openAddModal();
        }}
        onEditAddress={(address) => {
          setEditingAddress(address);
          openEditModal();
        }}
      />
      <AddressModal 
        modalId="add_address_modal"
        type = 'add'
        onSubmit={fetchAddresses}
      />
      <AddressModal 
        modalId="update_address_modal"
        type = 'edit'
        address={editingAddress}
        onSubmit={fetchAddresses}
      />
    </div>
  );
};

export default CheckoutForm;