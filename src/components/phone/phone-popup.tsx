// components/PhoneChangeModal.tsx
import React from 'react';
import DebounceInput from '../input/debounce-input';

type Props = {
  modalId: string;
  onPhoneChange: (oldPhone: string, newPhone: string) => void;
};

export default function PhoneChangeModal({ modalId, onPhoneChange }: Props) {
    const [oldPhone, setOldPhone] = React.useState('');
    const [newPhone, setNewPhone] = React.useState('');
    const handleSubmit = () => {
        onPhoneChange(oldPhone, newPhone);
        (document.getElementById(modalId) as HTMLDialogElement)?.close();
    }
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Change Phone Number</h3>
        
        <form method="dialog" onSubmit={handleSubmit}>
          <button 
            type='button'
            onClick={() => {
                (document.getElementById(modalId) as HTMLDialogElement)?.close();
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          
          <div className="space-y-4 mt-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Phone Number</span>
              </label>
              <DebounceInput
                type="tel"
                value={oldPhone}
                placeholder="Enter your old phone number"
                className="input input-bordered w-full"
                onChange={(value: string) => setOldPhone(value)}
                required
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>New Phone Number</span>
              </label>
              <DebounceInput
                type="tel"
                value={newPhone}
                placeholder="Enter your new phone number"
                className="input input-bordered w-full"
                onChange={(value: string) => setNewPhone(value)}
                required
              />
            </div>
          </div>

          <div className="modal-action mt-6">
            <button 
                type='button'
                onClick={() => {
                    (document.getElementById(modalId) as HTMLDialogElement)?.close()
                }}
                className="btn"
            >Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </dialog>
  );
}