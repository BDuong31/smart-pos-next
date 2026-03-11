// components/EmailChangeModal.tsx
import React from 'react';
import DebounceInput from '../input/debounce-input';

type Props = {
  modalId: string;
  onEmailChange: (newEmail: string, oldEmail: string) => void;
};

export default function EmailChangeModal({ modalId, onEmailChange }: Props) {
    const [email, setEmail] = React.useState('');
    const [emailOld, setEmailOld] = React.useState('');
    const handleSubmit = () => {
        onEmailChange(email, emailOld);
        (document.getElementById(modalId) as HTMLDialogElement)?.close();
    }
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Change Email</h3>
        <p className="py-4 text-sm text-gray-500">
        </p>

        <form method="dialog" onSubmit={handleSubmit}>
              <button 
                type='button'
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                    (document.getElementById(modalId) as HTMLDialogElement)?.close();
                }}
              >✕</button>
          
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Old</span>
              </label>
              <DebounceInput
                type="email"
                value={emailOld}
                placeholder="Enter your old email"
                className="input input-bordered w-full"
                onChange={(value: string) => setEmailOld(value)}
                required
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email New</span>
              </label>
              <DebounceInput
                type="email"
                value={email}
                placeholder="Enter your new email"
                className="input input-bordered w-full"
                onChange={(value: string) => setEmail(value)}
                required
              />
            </div>
          </div>

          <div className="modal-action mt-6">
            <button 
                type='button'
                onClick={() => {
                    (document.getElementById(modalId) as HTMLDialogElement)?.close();
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