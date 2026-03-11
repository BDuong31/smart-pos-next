'use client';
import { createAddress, updateAddress } from '@/apis/address';
import { useToast } from '@/context/toast-context';
import { useUserProfile } from '@/context/user-context';
import { IAddressCreate, IAddress, IAddressUpdate } from '@/interfaces/address';
import React, { FormEvent, useEffect } from 'react';

type Props = {
  modalId: string;
  address?: IAddress | null; 
  type: 'add' | 'edit';
  onSubmit?: (addressId: string, address: IAddressCreate | IAddressUpdate, type: 'add' | 'edit') => void;
};

type AddressFormData = {
  modalId: string;
  addresses: IAddress[]
  onSelectAddress: (address: IAddress) => void;
  onAddNew: () => void;
  onEditAddress: (address: IAddress) => void;
}

export default function AddressModal({ modalId, address, type, onSubmit }: Props) {
  const { userProfile } = useUserProfile();
  const [fullName, setFullName] = React.useState(address?.fullName || '');
  const [phone, setPhone] = React.useState(address?.phone || '');
  const [streetAddress, setStreetAddress] = React.useState(address?.streetAdress || '');
  const [cityProvince, setCityProvince] = React.useState(address?.cityProvince || '');
  const [isDefault, setIsDefault] = React.useState(address?.isDefault || false);

  useEffect(() => {
    if (type === 'edit' && address) {
      setFullName(address.fullName);
      setPhone(address.phone);
      setStreetAddress(address.streetAdress);
      setCityProvince(address.cityProvince);
      setIsDefault(address.isDefault);
    } else {
      setFullName('');
      setPhone('');
      setStreetAddress('');
      setCityProvince('');
      setIsDefault(false);
    }
  }, [type, address]);

  const resetForm = () => {
    if (type === 'edit' && address) {
      setFullName(address.fullName);
      setPhone(address.phone);
      setStreetAddress(address.streetAdress);
      setCityProvince(address.cityProvince);
      setIsDefault(address.isDefault);
    } else {
      setFullName('');
      setPhone('');
      setStreetAddress('');
      setCityProvince('');
      setIsDefault(false);
    }
  };

  const closeModal = () => {
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
    resetForm();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === 'add') {
      const newAddress: IAddressCreate = {
        userId: userProfile?.id || '',
        fullName: fullName || '',
        phone: phone || '',
        streetAdress: streetAddress || '',
        cityProvince: cityProvince || '',
        isDefault: isDefault || false,
      };
      try {
        if (onSubmit) {
          onSubmit('', newAddress, 'add');
        }
      } catch (error) {
        console.error('Error creating address:', error);
      }
    } else {
      try {
        const id = address?.id || '';
        const updatedAddress: IAddressUpdate = {
          fullName: fullName,
          phone: phone,
          streetAdress: streetAddress,
          cityProvince: cityProvince,
          isDefault: isDefault,
        }
        if (onSubmit) {
          onSubmit(id, updatedAddress, 'edit');
        }
      } catch (error) {
        console.error('Error updating address:', error); 
      }
    }
    closeModal();
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={(e) => { e.preventDefault(); closeModal(); }}
        >
          ✕
        </button>

        <h3 className="font-bold text-lg">
            {type === 'add' ? 'Add New Address' : 'Edit Address'}
        </h3>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Full Name</span></label>
              <input 
                type="text" 
                value={fullName}
                onChange={(value) => setFullName(value.target.value)}
                placeholder='Enter full name'
                className="input input-bordered w-full" 
                required 
            />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Phone Number</span></label>
              <input 
                type="tel" 
                value={phone}
                placeholder='Enter phone number'
                onChange={(value) => setPhone(value.target.value)}
                className="input input-bordered w-full"
                required 
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Street Address</span></label>
            <input 
              type="text"
              value={streetAddress}
              placeholder='Enter street address'
              onChange={(e) => setStreetAddress(e.target.value)}
              className="input input-bordered w-full"
              required 
            />
          </div>
          
          <div className="form-control">
            <label className="label"><span className="label-text">City / Province</span></label>
            <input 
              type="text"
              value={cityProvince}
              placeholder='Enter city or province'
              onChange={(e) => setCityProvince(e.target.value)}
              className="input input-bordered w-full"
              required 
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start space-x-2">
              <input type="checkbox" className="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
              <span className="label-text">Set as default address</span>
            </label>
          </div>

          <div className="modal-action mt-6">
            <button type="button" className="btn" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-neutral">
              Save
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function AddressListModal({modalId, addresses, onSelectAddress, onAddNew, onEditAddress } : AddressFormData) {
  const { showToast } = useToast();

  const closeModal = () => {
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
  };

  const handleSelect = (address: IAddress) => {
    onSelectAddress(address);
    closeModal();
  };

  const handleAddNewClick = () => {
    closeModal(); 
    onAddNew(); 
  };
  
  const handleEditClick = (address: IAddress) => {
    closeModal(); 
    onEditAddress(address); 
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={(e) => { e.preventDefault(); closeModal(); }}
        >
          ✕
        </button>

        <h3 className="font-bold text-lg mb-4">Select Address</h3>
        
        <div className="max-h-96 overflow-y-auto scrollbar-hide">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className="p-4 border rounded-lg mb-3 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(addr)}
            >
              <p className="font-semibold">{addr.fullName}</p>
              <p>{addr.streetAdress}, {addr.cityProvince}</p>
              <p>{addr.phone}</p>
              <button 
                className="link link-primary mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(addr);
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        <div className="modal-action mt-6">
          <button 
            type="button" 
            className="btn btn-neutral"
            onClick={handleAddNewClick}
          >
            Add New Address
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
