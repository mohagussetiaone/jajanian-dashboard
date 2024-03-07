import { Fragment, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Dialog, Transition } from '@headlessui/react';
import { Toaster } from 'react-hot-toast';

const ModalConfirmation = ({
  CDNURL,
  id,
  modalImagePreview,
  imagePreview,
  modalImageFullClose,
}) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const [hovered, setHovered] = useState(false);

  const showItem = (index) => {
    setSelectedItem(index);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const renderImages = () => {
    return (
      <div>
        <div
          className="mt-10 flex justify-center gap-4 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={`${CDNURL}/${id}/${imagePreview[selectedItem].name}`}
            alt={`Image Preview ${selectedItem + 1}`}
            className={`w-[600px] max-w-lg h-[300px] object-cover rounded-lg shadow transition-transform duration-300 ${
              hovered ? 'transform scale-150' : ''
            }`}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Toaster />
      <Transition appear show={modalImagePreview} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={modalImageFullClose}
        >
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
                <Dialog.Panel className="w-[625px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg border-b border-gray-600 pb-2 font-medium leading-6 text-gray-900"
                  >
                    <div className="flex justify-between">
                      <span>Image Produk</span>
                      <span>
                        <IoMdClose
                          className="text-red-500 w-5 h-5 cursor-pointer"
                          onClick={modalImageFullClose}
                        />
                      </span>
                    </div>
                  </Dialog.Title>
                  <div>
                    {renderImages()}
                    <div className="flex justify-center mt-4 py-6 overflow-x-auto gap-2">
                      {imagePreview.map((file, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer ${
                            selectedItem === index
                              ? 'border-2 border-blue-500'
                              : ''
                          }`}
                          onClick={() => showItem(index)}
                        >
                          <img
                            src={`${CDNURL}/${id}/${file.name}`}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
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
