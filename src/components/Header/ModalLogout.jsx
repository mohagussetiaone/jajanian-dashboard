import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Toaster } from 'react-hot-toast';

const ModalConfirmation = ({ modalLogout, modalLogoutClose, logout }) => {
  return (
    <>
      <Toaster />
      <Transition appear show={modalLogout} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={modalLogoutClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Apakah kamu yakin akan keluar?
                  </Dialog.Title>
                  <div className="mt-10 flex justify-center gap-4">
                    <button
                      type="button"
                      className="border-transparent inline-flex justify-center rounded-md border bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={modalLogoutClose}
                    >
                      Tidak
                    </button>
                    <button
                      type="button"
                      className="border-transparent hover:bg-red-00 inline-flex justify-center rounded-md border bg-red-100 hover:bg-red-200 px-4 py-2 text-sm font-medium text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={logout}
                    >
                      Ya
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalConfirmation;
