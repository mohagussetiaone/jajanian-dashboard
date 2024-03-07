import { Fragment } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import supabase from 'config/supabaseClient';
import { Dialog, Transition } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';

const ModalConfirmation = ({
  idCategory,
  deleteModalOpen,
  handleDeleteClose,
}) => {
  const queryClient = useQueryClient();

  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .schema('product')
        .from('categories')
        .delete()
        .eq('category_id', idCategory);
      handleDeleteClose();
      toast.success('Kategori produk Berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['categoryProductData'] });
      if (error) {
        toast.error('Kategori produk gagal dihapus');
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Toaster />
      <Transition appear show={deleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleDeleteClose}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Apakah kamu yakin akan menghapus kategori produk?
                  </Dialog.Title>
                  <div className="mt-10 flex justify-center gap-4">
                    <button
                      type="button"
                      className="border-transparent inline-flex justify-center rounded-md border bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleDeleteClose}
                    >
                      Tidak, Batalkan
                    </button>
                    <button
                      type="button"
                      className="border-transparent hover:bg-red-00 inline-flex justify-center rounded-md border bg-red-100 px-4 py-2 text-sm font-medium text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleDeleteProduct}
                    >
                      Ya, Proses
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
